import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Maximize2, RotateCcw, RotateCw } from 'lucide-react'
import type { ImplantPart, ImplantStudyScene } from './implantStudyScene'

type Lang = 'en' | 'ar' | 'fr' | 'ru'

export type ImplantStudyProps = { tooth: number; lang: Lang; amount: number; part: ImplantPart | null; onPart: (part: ImplantPart | null) => void; onChange: (value: number) => void; rotation: number; onRotate: (degrees: number) => void }

const copy: Record<Lang, {
  title: string; explainer: string; assembled: string; exploded: string; slider: string; crown: string; abutment: string; fixture: string; crownHint: string; abutmentHint: string; fixtureHint: string; loading: string; fallback: string; unavailable: string; directions: string
}> = {
  en: { title: 'Inside one implant', explainer: 'See the three parts that replace a tooth.', assembled: 'Assembled', exploded: 'Exploded', slider: 'Open implant parts', crown: 'Ceramic crown', abutment: 'Connector', fixture: 'Titanium implant', crownHint: 'Visible chewing surface', abutmentHint: 'Connects crown to implant', fixtureHint: 'Threaded support in bone', loading: 'Preparing the implant view', fallback: 'The part labels remain available while the model loads.', unavailable: 'The 3D inspection is not available on this device.', directions: 'Use the slider to separate the crown, connector and titanium implant. Start with Assembled, then choose Exploded to see each connection.' },
  ar: { title: 'ما بداخل زرعة واحدة؟', explainer: 'شاهد الأجزاء الثلاثة التي تعوّض السن.', assembled: 'مركّبة', exploded: 'مفكّكة', slider: 'فكّ أجزاء الزرعة', crown: 'تاج خزفي', abutment: 'الوصلة', fixture: 'زرعة من التيتانيوم', crownHint: 'سطح المضغ الظاهر', abutmentHint: 'يربط التاج بالزرعة', fixtureHint: 'دعم لولبي داخل العظم', loading: 'جارٍ تجهيز عرض الزرعة', fallback: 'تظل أسماء الأجزاء ظاهرة أثناء تحميل النموذج.', unavailable: 'عرض الفحص ثلاثي الأبعاد غير متاح على هذا الجهاز.', directions: 'استخدم الشريط لفصل التاج والوصلة والزرعة. ابدأ بعرض «مركّبة»، ثم اختر «مفكّكة» لرؤية نقاط الاتصال.' },
  fr: { title: 'Dans un implant', explainer: 'Découvrez les trois pièces qui remplacent une dent.', assembled: 'Assemblé', exploded: 'Décomposé', slider: 'Séparer les pièces', crown: 'Couronne céramique', abutment: 'Pilier', fixture: 'Implant en titane', crownHint: 'Surface de mastication visible', abutmentHint: 'Relie couronne et implant', fixtureHint: 'Support fileté dans l’os', loading: 'Préparation de la vue de l’implant', fallback: 'Les noms des pièces restent disponibles pendant le chargement.', unavailable: 'La vue d’inspection 3D n’est pas disponible sur cet appareil.', directions: 'Utilisez le curseur pour séparer la couronne, le pilier et l’implant en titane. Commencez assemblé, puis choisissez décomposé pour voir les connexions.' },
  ru: { title: 'Из чего состоит имплант', explainer: 'Посмотрите на три части, заменяющие зуб.', assembled: 'Собран', exploded: 'Разобран', slider: 'Разобрать части импланта', crown: 'Керамическая коронка', abutment: 'Абатмент', fixture: 'Титановый имплант', crownHint: 'Видимая жевательная поверхность', abutmentHint: 'Соединяет коронку и имплант', fixtureHint: 'Резьбовая опора в кости', loading: 'Подготовка вида импланта', fallback: 'Названия частей доступны во время загрузки модели.', unavailable: 'Трёхмерный осмотр недоступен на этом устройстве.', directions: 'Перемещайте ползунок, чтобы разделить коронку, абатмент и титановый имплант. Начните со «Собран», затем выберите «Разобран», чтобы увидеть соединения.' },
}

/** A one-thumb, fixed-camera inspection designed for the tooth case. */
export function ImplantStudy({ tooth, lang, amount, part, onPart, onChange, rotation, onRotate }: ImplantStudyProps) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<ImplantStudyScene | null>(null)
  const amountRef = useRef(amount)
  const partRef = useRef(part)
  const rotationRef = useRef(rotation)
  const drag = useRef<{ id: number; startX: number; degrees: number } | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const c = copy[lang]
  const fallbackImage = amount >= 0.5 ? '/models/previews/implant-exploded.webp' : '/models/previews/implant-assembled.webp'

  useEffect(() => {
    const node = host.current
    if (!node) return
    let alive = true
    const controller = new AbortController()
    setReady(false)
    setFailed(false)
    void import('./implantStudyScene').then(({ createImplantStudyScene }) => createImplantStudyScene({
      host: node,
      tooth,
      amount: amountRef.current,
      signal: controller.signal,
      onReady: () => alive && setReady(true),
    })).then((created) => {
      if (!alive) return created.dispose()
      scene.current = created
      created.setAmount(amountRef.current)
      created.inspect(partRef.current)
      created.rotate(rotationRef.current)
    }).catch(() => {
      if (alive) setFailed(true)
    })
    return () => {
      alive = false
      controller.abort()
      scene.current?.dispose()
      scene.current = null
    }
  }, [tooth])

  useEffect(() => {
    amountRef.current = amount
    scene.current?.setAmount(amount)
  }, [amount])

  useEffect(() => {
    partRef.current = part
    scene.current?.inspect(part)
  }, [part])

  useEffect(() => {
    rotationRef.current = rotation
    scene.current?.rotate(rotation)
  }, [rotation])

  function turn(degrees: number) {
    const rounded = Math.round(degrees * 10) / 10
    rotationRef.current = ((rounded + 180) % 360 + 360) % 360 - 180
    scene.current?.rotate(rotationRef.current)
  }

  function finishTurn() {
    if (!drag.current) return
    drag.current = null
    onRotate(rotationRef.current)
  }

  const turnLabels = {
    en: ['Drag sideways to turn', 'Turn left', 'Turn right'],
    ar: ['اسحب يمينًا أو يسارًا للتدوير', 'دوّر لليسار', 'دوّر لليمين'],
    fr: ['Glissez pour faire tourner', 'Tourner à gauche', 'Tourner à droite'],
    ru: ['Проведите вбок для поворота', 'Повернуть влево', 'Повернуть вправо'],
  }[lang]

  const ui = {
    en: { title: 'Inside a dental implant', tooth: 'Tooth', inspect: 'Tap a part for a close-up', all: 'Show all parts', still: 'Reference molar 46 · choose a view', connector: 'Abutment' },
    ar: { title: 'زرعة الأسنان من الداخل', tooth: 'السن', inspect: 'اضغط على الجزء لتراه عن قرب', all: 'شاهد كل الأجزاء', still: 'الضرس ٤٦ · اختر إحدى الصورتين', connector: 'الدعامة' },
    fr: { title: 'Au cœur d’un implant dentaire', tooth: 'Dent', inspect: 'Touchez une pièce pour l’agrandir', all: 'Voir toutes les pièces', still: 'Molaire 46 · sélectionnez une vue', connector: 'Pilier' },
    ru: { title: 'Устройство зубного имплантата', tooth: 'Зуб', inspect: 'Коснитесь детали, чтобы увеличить', all: 'Показать все детали', still: 'Моляр 46 · выберите вид', connector: 'Абатмент' },
  }[lang]
  const parts = [
    { id: 'crown', label: c.crown, description: c.crownHint, swatch: 'linear-gradient(135deg,#bca481,#fffaf0 53%,#d5c4aa)' },
    { id: 'abutment', label: ui.connector, description: c.abutmentHint, swatch: 'linear-gradient(115deg,#534535,#decaa8 43%,#8d785d 57%,#cfb58a)' },
    { id: 'fixture', label: c.fixture, description: c.fixtureHint, swatch: 'linear-gradient(115deg,#45515a,#cbd1d4 42%,#65747d 56%,#a9b4bd)' },
  ] as const
  const active = parts.find(entry => entry.id === part)
  function setSeparation(value: number) {
    onPart(null)
    onChange(value)
  }

  return (
    <section aria-labelledby="implant-study-title" className="min-w-0 overflow-hidden rounded-3xl border border-[#c9c0ae] bg-[#faf8f4]">
      <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 sm:px-6">
        <h3 id="implant-study-title" className="font-display text-lg font-medium leading-tight tracking-tight text-[#25221d] sm:text-xl">{ui.title}</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6cdbf] px-2.5 py-1 text-xs text-[#5a5146]">{ui.tooth} <bdi className="font-semibold">{failed ? 46 : tooth}</bdi></span>
      </header>

      <div className="relative isolate h-[clamp(300px,45svh,485px)] overflow-hidden bg-[radial-gradient(ellipse_at_42%_36%,#485259_0%,#293238_39%,#141c21_76%,#0d1418_100%)] sm:h-[clamp(350px,58svh,575px)]">
        <div ref={host} className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
          onPointerDown={event => {
            if (!ready || !event.isPrimary || event.button !== 0) return
            drag.current = { id: event.pointerId, startX: event.clientX, degrees: rotationRef.current }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={event => {
            const start = drag.current
            if (start && start.id === event.pointerId) turn(start.degrees + (event.clientX - start.startX) * 0.7)
          }}
          onPointerUp={finishTurn} onPointerCancel={finishTurn} onLostPointerCapture={finishTurn} />
        {failed && <img src={fallbackImage} alt={amount >= 0.5 ? c.exploded : c.assembled} className="absolute inset-0 h-full w-full object-contain" />}
        {!ready && !failed && <p role="status" className="absolute inset-x-4 top-1/2 text-center text-sm text-[#f7f1e6]">{c.loading}</p>}
        {active && ready && !failed && (
          <button type="button" onClick={() => onPart(null)} className="absolute start-2.5 top-2.5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/25 bg-[#141c21]/90 px-3 text-xs font-medium text-white focus-visible:outline-2 focus-visible:outline-white">
            <ArrowLeft size={14} aria-hidden className="rtl:rotate-180" />{ui.all}
          </button>
        )}
      </div>

      {ready && !failed && <div className="flex min-h-11 items-center justify-between gap-2 border-t border-white/10 bg-[#172025] px-3 text-xs text-[#e3e5e1]">
        <span>{turnLabels[0]}</span>
        <div className="flex" dir="ltr">
          {[-30, 30].map((step, index) => <button type="button" key={step} aria-label={turnLabels[index + 1]} onClick={() => { turn(rotationRef.current + step); onRotate(rotationRef.current) }} className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/10 focus-visible:outline-2">
            {step < 0 ? <RotateCcw size={17} /> : <RotateCw size={17} />}
          </button>)}
        </div>
      </div>}
      <div className="space-y-3 p-3.5 sm:space-y-4 sm:p-5">
        <div className="grid grid-cols-2 gap-1 rounded-[14px] bg-[#e8e4dc] p-1">
          {[{ label: c.assembled, value: 0 }, { label: c.exploded, value: 1 }].map(({label, value}) => (
            <button key={value} type="button" aria-pressed={!part && (failed ? Number(amount >= 0.5) === value : amount === value)} onClick={() => setSeparation(value)} className="min-h-11 rounded-[10px] px-2 text-[13px] font-semibold text-[#4e4a43] aria-pressed:bg-[#252a2c] aria-pressed:text-white">{label}</button>
          ))}
        </div>
        {failed ? <p role="status" className="text-xs text-[#655f54]">{ui.still}</p> : (
          <label className="flex min-h-11 items-center gap-3 text-[12px] font-medium text-[#514d46]">
            <span className="max-w-[40%] shrink-0">{c.slider}</span>
            <input type="range" min="0" max="100" value={Math.round(amount * 100)} onChange={event => setSeparation(Number(event.target.value) / 100)} dir="ltr" className="min-h-11 min-w-0 flex-1 accent-[#414947]" aria-label={c.slider} />
          </label>
        )}
        <div className="border-t border-[#d9d3c8] pt-3">
          {!failed && <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#514c42]"><Maximize2 size={13} aria-hidden />{ui.inspect}</p>}
          <div className="grid grid-cols-3 gap-1.5">
            {parts.map(entry => (
              <button key={entry.id} type="button" disabled={failed || !ready} aria-pressed={part === entry.id} onClick={() => onPart(part === entry.id ? null : entry.id)} className="flex min-h-14 flex-col items-start gap-1.5 rounded-xl border border-[#d7d1c6] bg-white px-2.5 py-2.5 text-start text-[12px] font-medium leading-tight text-[#393731] aria-pressed:border-[#343e42] aria-pressed:bg-[#e8edef] sm:flex-row sm:items-center sm:gap-2">
                <span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/15" style={{background:entry.swatch}} />{entry.label}
              </button>
            ))}
          </div>
          {active && !failed && <p role="status" className="mt-2 text-[13px] text-[#595349]">{active.description}</p>}
          {failed && <p className="mt-2 text-xs text-[#595349]">{parts.map(entry => entry.label + ' · ' + entry.description).join(' / ')}</p>}
        </div>
        {(tooth === 36 || tooth === 46 || failed) && <details className="text-[11px] leading-relaxed text-[#625c52]">
          <summary className="w-fit cursor-pointer py-2">{ {en:'Crown model source',ar:'مصدر نموذج التاج',fr:'Source du modèle de couronne',ru:'Источник модели коронки'}[lang] }</summary>
          <p><a className="underline" href="https://doi.org/10.17632/97c3pf8h2h.1">Cristian Diaz, Carlos Andres Ferro Sanchez &amp; Oscar Campo (2024)</a> · <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
          <p>{ {en:'Ozea isolated and oriented the crown from tooth 46. Tooth 36 uses a mirrored view.',ar:'عزلت Ozea تاج الضرس ٤٦ وضبطت اتجاهه. يُعرض الضرس ٣٦ بنسخة معكوسة.',fr:'Ozea a isolé et orienté la couronne de la dent 46. La dent 36 utilise une vue en miroir.',ru:'Ozea выделила и развернула коронку зуба 46. Для зуба 36 используется зеркальная модель.'}[lang] }</p>
        </details>}
      </div>
    </section>
  )
}
