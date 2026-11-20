import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Compass } from 'lucide-react'
import type { Lang } from '@/lib/copy'
import { pageMeta } from '@/lib/pages'

/** A question, not a diagnosis: the viewer uses this to frame a reference view. */
export type FaceAdviceTopic = 'profile' | 'bite' | 'asymmetry'

type TreatmentLink = 'jaw-surgery' | 'maxillofacial-surgery'
const evaluationGuide = {
  en: 'How a jaw assessment works · AAOMS',
  ar: 'كيف يُقيَّم الفك؟ دليل جمعية جرّاحي الفم والوجه والفكّين الأمريكية (بالإنجليزية)',
  fr: 'Comprendre le bilan des mâchoires · AAOMS (en anglais)',
  ru: 'Как оценивают положение челюстей · AAOMS (на английском)',
}

type AdviceItem = {
  topic: FaceAdviceTopic
  title: string
  question: string
  body: string
  looksAt: readonly string[]
  action: string
  link: string
  page: TreatmentLink
}

type FaceAdviceCopy = {
  eyebrow: string
  headline: string
  outlined: string
  anchor: string
  lead: string
  noteTitle: string
  note: string
  looksAt: string
  items: readonly AdviceItem[]
}

const faceAdviceCopy: Record<Lang, FaceAdviceCopy> = {
  en: {
    eyebrow: 'Face and jaw questions',
    headline: 'What would you like',
    outlined: 'to understand?',
    anchor: 'Explore the face and jaw guide',
    lead:
      'Pick the question closest to yours. Each one opens the model at an angle that helps you point out what you mean. You can share that exact view with Ozea.',
    noteTitle: 'How a clinician assesses your own face and bite',
    note:
      'This is a teaching model. Advice about your own face or bite depends on your history, an examination and any imaging your clinician considers appropriate.',
    looksAt: 'What may be discussed',
    items: [
      {
        topic: 'profile',
        title: 'Profile and jaw position',
        question: 'Why does my chin look set back or prominent from the side?',
        body:
          'Open the side view. Trace the outline from the upper lip to the chin, then turn the face layer off to see the bone underneath. This can help you explain which part of your profile you want to discuss.',
        looksAt: ['The relationship of the upper and lower jaws', 'How the teeth meet', 'Records or imaging, if appropriate'],
        action: 'See the side profile',
        link: 'Read about corrective jaw surgery',
        page: 'jaw-surgery',
      },
      {
        topic: 'bite',
        title: 'The way the teeth meet',
        question: 'What should I point out if my teeth meet unevenly?',
        body:
          'Look at where the upper and lower teeth meet. When you describe your own bite, it helps to say where you feel contact first and whether that is at the front, at the back, or on one side.',
        looksAt: ['Where the teeth touch', 'Jaw position and movement', 'Information from your orthodontist, if you have one'],
        action: 'See how the teeth meet',
        link: 'Explore jaw surgery information',
        page: 'jaw-surgery',
      },
      {
        topic: 'asymmetry',
        title: 'Facial asymmetry',
        question: 'How do I describe a difference between the two sides of my jaw?',
        body:
          'Start from the front. Find the chin and the centre of the upper teeth. If you have a question about your own face, describe which area caught your attention and when you first noticed it.',
        looksAt: ['Facial proportions from more than one view', 'The midline and the bite', 'Your history and the information already available'],
        action: 'See the face from the front',
        link: 'Learn about maxillofacial care',
        page: 'maxillofacial-surgery',
      },
    ],
  },
  ar: {
    eyebrow: 'أسئلة عن الوجه والفكين',
    headline: 'ما الذي تود فهمه',
    outlined: 'عن وجهك وفكّك؟',
    anchor: 'استكشف دليل الوجه والفكين',
    lead:
      'اختر السؤال الأقرب لما يشغلك. سيفتح النموذج من الزاوية المناسبة لتشير إلى ما تقصده. ويمكنك مشاركة الزاوية نفسها مع العيادة على واتساب.',
    noteTitle: 'كيف يقيّم الطبيب حالة وجهك وفكّك؟',
    note:
      'هذا نموذج تعليمي. لإبداء رأي يخصّ حالتك، يسألك الطبيب عمّا لاحظته ويفحص الوجه والفكّين وطريقة تلامس الأسنان، وقد يطلب أشعة عند الحاجة.',
    looksAt: 'ما قد يُناقَش في الكشف',
    items: [
      {
        topic: 'profile',
        title: 'بروز الذقن أو تراجعه',
        question: 'لماذا يبدو ذقني بارزًا أو متراجعًا عندما أرى وجهي من الجانب؟',
        body:
          'افتح المنظر الجانبي وتتبع خط الوجه من الشفة العليا إلى الذقن. اضغط على زر الوجه لإخفاء الطبقة الخارجية ورؤية العظام تحتها. بهذه الطريقة يسهل أن توضّح للطبيب أي جزء تقصد.',
        looksAt: ['علاقة الفك العلوي بالفك السفلي', 'طريقة تلاقي الأسنان', 'الأشعة أو السجلات عند الحاجة'],
        action: 'شاهد الوجه من الجانب',
        link: 'اقرأ عن جراحة تصحيح الفكين',
        page: 'jaw-surgery',
      },
      {
        topic: 'bite',
        title: 'إطباق الأسنان',
        question: 'كيف أشرح للطبيب أن أسناني تلمس بعضها من ناحية قبل الأخرى؟',
        body:
          'انظر إلى موضع التقاء الأسنان العلوية والسفلية على النموذج. وعندما تصف إحساسك أنت، حدّد أين تشعر بأول تلامس عند إغلاق فمك: في الأمام أم الخلف، وعلى أي جانب؟',
        looksAt: ['مواضع تلامس الأسنان', 'وضع الفك وحركته', 'معلومات طبيب التقويم إن وُجدت'],
        action: 'شاهد كيف تتلامس الأسنان',
        link: 'استكشف معلومات جراحة الفكين',
        page: 'jaw-surgery',
      },
      {
        topic: 'asymmetry',
        title: 'عدم تماثل جانبي الوجه',
        question: 'ألاحظ فرقًا بين يمين الفك ويساره. كيف أصف ما أراه؟',
        body:
          'شاهد النموذج من الأمام وحدّد موضع الذقن ومنتصف الأسنان العلوية. وعند الحديث عن وجهك، اذكر الجزء الذي لفت نظرك ومتى لاحظت الفرق أول مرة.',
        looksAt: ['ملامح الوجه من أكثر من زاوية', 'خط المنتصف والإطباق', 'تاريخك والمعلومات المتاحة'],
        action: 'شاهد الوجه من الأمام',
        link: 'تعرّف على رعاية الوجه والفكين',
        page: 'maxillofacial-surgery',
      },
    ],
  },
  fr: {
    eyebrow: 'Questions sur le visage et les mâchoires',
    headline: 'Partez de la question',
    outlined: 'que vous vous posez.',
    anchor: 'Explorer le guide visage et mâchoires',
    lead:
      'Un profil, la façon dont les dents se rencontrent ou une différence entre les deux côtés du visage peuvent être de bonnes raisons d’en parler avec un chirurgien maxillo-facial. Ce guide ne peut pas identifier la cause d’un trait ni dire si un traitement est nécessaire. Il vous aide à formuler votre question et à repérer une vue de référence dans le modèle ci-dessus.',
    noteTitle: 'Un point de départ, pas une évaluation',
    note:
      'Une même apparence peut avoir des causes différentes. Avant de donner un avis, le praticien tient compte de vos antécédents, de l’occlusion, de l’examen et des images utiles. Le modèle 3D est une illustration générale : ce n’est ni votre scanner ni la promesse d’un résultat.',
    looksAt: 'Ce qui peut être discuté',
    items: [
      {
        topic: 'profile', title: 'Profil et position des mâchoires', question: 'Mon menton, ma mâchoire supérieure ou inférieure paraît-il en avant ou en retrait par rapport au reste du visage ?',
        body: 'Un profil ne se juge pas sur une seule photo. La discussion peut porter sur le rapport entre les mâchoires, la façon dont les dents se rencontrent et les examens qui seraient utiles. Le modèle montre une position de référence du menton et des mâchoires.',
        looksAt: ['Le rapport entre les deux mâchoires', 'La rencontre des dents', 'Les examens ou images utiles, si besoin'], action: 'Afficher la vue de profil', link: 'Lire sur la chirurgie correctrice des mâchoires', page: 'jaw-surgery',
      },
      {
        topic: 'bite', title: 'La façon dont les dents se rencontrent', question: 'Mes dents de devant ou du fond se rencontrent-elles différemment de ce que j’attends ?',
        body: 'L’occlusion ne concerne pas seulement la forme des dents. Les contacts dentaires, les mouvements de la mâchoire et les informations orthodontiques peuvent être utiles. Le modèle aide à montrer les deux mâchoires, sans choisir de traitement.',
        looksAt: ['Les points de contact des dents', 'La position et le mouvement de la mâchoire', 'Les informations orthodontiques disponibles'], action: 'Afficher la vue de l’occlusion', link: 'Explorer les informations sur la chirurgie des mâchoires', page: 'jaw-surgery',
      },
      {
        topic: 'asymmetry', title: 'Une différence entre les deux côtés', question: 'Ai-je remarqué une différence entre le côté droit et le côté gauche de mon visage, de mon menton ou de mon occlusion ?',
        body: 'Une différence entre les deux côtés peut être perceptible. Si cela compte pour vous, il est utile de préciser depuis quand vous le remarquez et si votre occlusion est concernée. Le praticien peut dire si l’examen, des images ou un autre avis apporteraient des informations utiles.',
        looksAt: ['Les proportions du visage sous plusieurs angles', 'La ligne médiane et l’occlusion', 'Vos antécédents et les informations disponibles'], action: 'Afficher la vue du visage', link: 'Découvrir la chirurgie maxillo-faciale', page: 'maxillofacial-surgery',
      },
    ],
  },
  ru: {
    eyebrow: 'Вопросы о лице и челюстях',
    headline: 'Начните с вопроса,',
    outlined: 'который хотите обсудить.',
    anchor: 'Открыть гид по лицу и челюстям',
    lead:
      'Профиль, то, как смыкаются зубы, или разница между сторонами лица могут быть поводом поговорить с челюстно-лицевым хирургом. Этот гид не определяет причину особенности и не говорит, нужно ли лечение. Он помогает точнее сформулировать вопрос и показывает справочный ракурс модели выше.',
    noteTitle: 'Отправная точка, а не заключение',
    note:
      'Одинаковый внешний вид может иметь разные причины. Прежде чем высказать мнение, врач учитывает анамнез, прикус, осмотр и подходящие снимки. 3D-модель — общая иллюстрация, а не ваше КТ и не прогноз результата.',
    looksAt: 'Что могут обсудить',
    items: [
      {
        topic: 'profile', title: 'Профиль и положение челюстей', question: 'Кажется ли мне, что подбородок, верхняя или нижняя челюсть выступает вперёд или назад относительно лица?',
        body: 'Профиль не оценивают по одной фотографии. Разговор может касаться соотношения челюстей, смыкания зубов и того, какие записи или снимки будут полезны. Модель показывает нейтральный справочный вид подбородка и челюстей.',
        looksAt: ['Соотношение верхней и нижней челюсти', 'Смыкание зубов', 'Снимки или записи, если это уместно'], action: 'Показать профиль', link: 'Подробнее о коррекции челюстей', page: 'jaw-surgery',
      },
      {
        topic: 'bite', title: 'Как смыкаются зубы', question: 'Смыкаются ли передние или задние зубы не так, как я ожидаю?',
        body: 'Прикус — это не только форма отдельных зубов. Могут иметь значение контакты зубов, движение челюсти и ортодонтическая информация. Модель помогает указать на верхнюю и нижнюю челюсть, но не выбирает лечение.',
        looksAt: ['Точки контакта зубов', 'Положение и движение челюсти', 'Имеющаяся ортодонтическая информация'], action: 'Показать вид прикуса', link: 'Изучить информацию об операциях на челюстях', page: 'jaw-surgery',
      },
      {
        topic: 'asymmetry', title: 'Разница между сторонами лица', question: 'Замечаю ли я разницу между правой и левой стороной лица, подбородка или прикуса?',
        body: 'Разница между сторонами лица может быть заметной. Если это важно для вас, полезно описать, давно ли вы это замечаете и связано ли это с прикусом. Врач может определить, принесут ли осмотр, снимки или другое мнение дополнительную пользу.',
        looksAt: ['Пропорции лица с нескольких ракурсов', 'Среднюю линию и прикус', 'Ваш анамнез и доступную информацию'], action: 'Показать вид лица', link: 'Узнать о челюстно-лицевой хирургии', page: 'maxillofacial-surgery',
      },
    ],
  },
}

export function FaceAdvice({ lang, path, onSelect }: { lang: Lang; path: (to: string) => string; onSelect: (topic: FaceAdviceTopic) => void }) {
  const [selected, setSelected] = useState<FaceAdviceTopic | null>(null)
  const copy = faceAdviceCopy[lang]

  const select = (topic: FaceAdviceTopic) => {
    setSelected(topic)
    onSelect(topic)
  }

  return (
    <section aria-labelledby="face-advice" className="rounded-[1.75rem] bg-[#F6F2EA] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">{copy.eyebrow}</p>
          <h2 id="face-advice" className="font-display mt-4 max-w-[18ch] text-[clamp(1.7rem,3.8vw,3rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]">
            {copy.headline} <span className="text-outline">{copy.outlined}</span>
          </h2>
        </div>
        <p data-answer className="max-w-[62ch] text-[15px] leading-[1.75] text-[#3a352f]">{copy.lead}</p>
      </div>

      <div className="mt-9 grid gap-3 xl:mt-14 xl:grid-cols-3 xl:gap-4">
        {copy.items.map((item) => {
          const active = selected === item.topic
          return (
            <article key={item.topic} className={`rounded-[1.5rem] border p-5 transition-colors sm:p-6 ${active ? 'border-[#14120F] bg-white' : 'border-[#14120F]/10 bg-white/60'}`}>
              <Compass aria-hidden className="h-4 w-4 text-[#C0A578]" />
              <h3 className="font-display mt-5 text-[22px] font-medium leading-[1.08] text-[#14120F]">{item.title}</h3>
              <p className="mt-4 text-[15px] font-medium leading-[1.55] text-[#29251f]">{item.question}</p>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#5f584d]">{item.body}</p>
              <div className="mt-6 border-t border-[#14120F]/10 pt-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6f685c]">{copy.looksAt}</p>
                <ul className="mt-3 space-y-2 text-[13px] leading-snug text-[#3a352f]">
                  {item.looksAt.map((point) => <li key={point} className="flex gap-2"><span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C0A578]" />{point}</li>)}
                </ul>
              </div>
              <button type="button" aria-controls="planning-viewer" onClick={() => select(item.topic)} className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#14120F] px-5 py-3 text-[12px] font-medium text-white transition-transform hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14120F]">
                {item.action}
              </button>
              <Link to={path(pageMeta(item.page).path)} className="group mt-4 flex min-h-9 items-center justify-between gap-3 text-[12px] font-medium text-[#3a352f] hover:text-[#14120F]">
                <span>{item.link}</span><ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-[#8a8172] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
              </Link>
            </article>
          )
        })}
      </div>

      <aside className="mt-5 flex gap-3 rounded-[1.25rem] border border-[#14120F]/10 bg-white/60 p-5 text-[13px] leading-[1.7] text-[#5f584d] xl:mt-7">
        <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C0A578]" />
        <div>
          <p><strong className="me-1 font-medium text-[#29251f]">{copy.noteTitle}</strong></p>
          <p>{copy.note}</p>
          <a href="https://myoms.org/what-we-do/corrective-jaw-surgery/joint-stabilization-and-diagnosis-in-orthognathic-surgery/" className="mt-2 inline-flex min-h-11 items-center underline decoration-[#a18c68] underline-offset-4">{evaluationGuide[lang]}</a>
        </div>
      </aside>
    </section>
  )
}

export function FaceAdviceLink({ lang }: { lang: Lang }) {
  return (
    <a href="#face-advice" className="inline-flex min-h-11 items-center gap-1.5 underline decoration-[#C0A578] underline-offset-4">
      {faceAdviceCopy[lang].anchor}
      <ArrowRight aria-hidden className="h-3.5 w-3.5 rtl:rotate-180" />
    </a>
  )
}
