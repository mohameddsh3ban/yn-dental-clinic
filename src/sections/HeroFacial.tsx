import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Instagram, MapPin, Phone } from 'lucide-react'
import { BrandLockup } from '@/components/BrandLogo'
import { MobileMenu } from '@/components/MobileMenu'
import { LanguageToggle } from '@/components/LanguageToggle'
import { WhatsAppIcon } from '@/components/icons'
import { flat, snap } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { navLinks } from '@/lib/nav'
import { PLANNING_PATH } from '@/lib/planning3d'
import { site, whatsappUrl } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.06 + i * 0.07, ease } }) }

/** A static LCP gateway. The interactive model loads only on its own route. */
const PLANNING_ART = {
  src: '/hero/planning-studio-960.webp',
  srcSet: '/hero/planning-studio-400.webp 400w, /hero/planning-studio-640.webp 640w, /hero/planning-studio-960.webp 960w',
  sizes: '(min-width: 1536px) 680px, (min-width: 1024px) 52vw, (min-width: 640px) 78vw, 100vw',
} as const

const socials = [{ key: 'instagram', href: site.instagram, Icon: Instagram }, { key: 'googleMaps', href: site.maps.link, Icon: MapPin }] as const

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => unknown
}

/** Wait for the stable viewer stage, rather than transitioning to a lazy-route shell. */
function waitForStudioStage() {
  return new Promise<HTMLElement | null>((resolve) => {
    const found = document.querySelector<HTMLElement>('[data-studio-stage]')
    if (found) return resolve(found)

    const observer = new MutationObserver(() => {
      const stage = document.querySelector<HTMLElement>('[data-studio-stage]')
      if (!stage) return
      observer.disconnect()
      window.clearTimeout(timeout)
      resolve(stage)
    })
    const timeout = window.setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, 1_500)
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

export default function HeroFacial() {
  const { c, t, path } = useI18n()
  const reduced = useReducedMotion()
  const still = snap || reduced
  const navigate = useNavigate()
  const [isEnteringStudio, setIsEnteringStudio] = useState(false)
  const entryTimer = useRef<number | null>(null)
  const init = still ? false : 'hidden'
  const whatsapp = whatsappUrl(c.site.whatsappMessage)
  const planningPath = path(PLANNING_PATH)
  const gateway = c.hero.planningGateway

  useEffect(() => () => {
    if (entryTimer.current !== null) window.clearTimeout(entryTimer.current)
  }, [])

  async function openStudio() {
    flushSync(() => navigate(planningPath))
    const stage = await waitForStudioStage()
    stage?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' })
    stage?.focus({ preventScroll: true })
  }

  const enterStudio = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()
    if (entryTimer.current !== null) return
    if (still || event.detail === 0) {
      void openStudio()
      return
    }

    const transitionDocument = document as ViewTransitionDocument
    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(openStudio)
      return
    }

    setIsEnteringStudio(true)
    entryTimer.current = window.setTimeout(() => void openStudio(), 180)
  }

  return (
    <section id="hero" aria-labelledby="hero-h1" className="bg-[#CFC8BC] p-3 sm:p-4 xl:p-6">
      <div className={`hero-canvas relative overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem] ${flat ? '' : 'min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] xl:min-h-[max(calc(100vh-3rem),780px)]'}`}>
        <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 z-0" />
        <div aria-hidden className="font-display pointer-events-none absolute -bottom-[7vw] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap text-[27vw] font-semibold leading-none tracking-tighter text-white/[0.15] xl:text-[20vw]">{c.site.short}</div>

        <motion.header variants={fadeUp} initial={init} animate="show" className="relative z-30 flex items-center justify-between px-5 pt-6 sm:px-10 xl:px-14 xl:pt-9 2xl:px-20">
          <BrandLockup />
          <nav aria-label={c.common.mainNav} className="hidden items-center gap-3 text-[11px] font-medium text-[#3a352f] xl:gap-4 xl:text-[12px] lg:flex">
            {navLinks(c).map(([label, href]) => <a key={href} href={href} className="transition-colors hover:text-[#14120F]">{label}</a>)}
            <Link to={planningPath} className="rounded-full border border-[#14120F]/15 px-3 py-2 text-[#14120F] transition-colors hover:border-[#14120F]/35 hover:bg-white/40">{gateway.navLabel}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={c.common.whatsapp} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#14120F] px-2.5 py-2.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.97] sm:px-5"><WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" /><span className="max-sm:hidden">{c.common.whatsapp}</span></a>
            <MobileMenu className="lg:hidden" />
          </div>
        </motion.header>

        <div className="relative z-10 mx-auto grid w-full max-w-[1760px] gap-8 px-6 pb-8 pt-10 sm:px-10 sm:pb-10 lg:grid-cols-[0.83fr_1.17fr] lg:items-center lg:gap-12 xl:px-14 xl:pb-14 xl:pt-14 2xl:px-20">
          <div className="order-1 max-w-[600px] lg:py-10">
            <motion.p variants={fadeUp} initial={init} animate="show" custom={1} className="text-[11px] font-medium uppercase tracking-[0.19em] text-[#6f685c]">{c.hero.eyebrow}</motion.p>
            <h1 id="hero-h1" className="font-display mt-5 text-[clamp(2.4rem,5.2vw,5.35rem)] font-medium uppercase leading-[0.94] tracking-[-0.035em] text-[#14120F]">{c.hero.headlineTop} <span className="text-outline">{c.hero.headlineOutlined}</span></h1>
            <motion.p variants={fadeUp} initial={init} animate="show" custom={3} className="mt-6 max-w-[51ch] text-[15px] leading-[1.72] text-[#3a352f] xl:text-[16px]">{c.hero.lead}</motion.p>
            <motion.div variants={fadeUp} initial={init} animate="show" custom={4} className="mt-8 flex flex-wrap gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={t(c.hero.bookAria, { doctor: c.site.doctor })} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#14120F] px-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.97]"><WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />{c.hero.book}</a>
              <a href={`tel:${site.phones[0].tel}`} className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/45 px-5 text-[13px] font-medium text-[#14120F] transition-colors hover:border-[#14120F]/35 hover:bg-white/70"><Phone className="h-3.5 w-3.5" /><bdi dir="ltr" className="tabular-nums">{site.phones[0].label}</bdi></a>
              <Link to={planningPath} onClick={enterStudio} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#14120F]/15 bg-white/45 px-6 text-[13px] font-medium text-[#14120F] transition-colors hover:border-[#14120F]/35 hover:bg-white/70">{gateway.action}<ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
            </motion.div>
          </div>

          <div className="order-2 w-full lg:justify-self-end">
            <motion.div style={{ viewTransitionName: 'ozea-planning-studio' }} animate={isEnteringStudio && !still ? { scale: 1.018, filter: 'brightness(1.08)' } : { scale: 1, filter: 'brightness(1)' }} transition={{ duration: 0.18, ease }} whileTap={still ? undefined : { scale: 0.992 }} className="group relative overflow-hidden rounded-[1.5rem] bg-[#211f1a] shadow-[0_30px_65px_-35px_rgba(20,18,15,0.8)] sm:rounded-[2rem]">
              <Link to={planningPath} onClick={enterStudio} aria-label={gateway.action} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14120F]">
                <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[clamp(490px,65svh,720px)]">
                  <img src={PLANNING_ART.src} srcSet={PLANNING_ART.srcSet} sizes={PLANNING_ART.sizes} alt={gateway.figureAlt} fetchPriority="high" className="h-full w-full object-cover object-center lg:object-[center_46%] transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.025]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#14120F]/85 via-transparent to-[#14120F]/10" />
                  <motion.div aria-hidden animate={{ opacity: isEnteringStudio && !still ? 0.22 : 0 }} transition={{ duration: 0.16, ease }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,240,207,0.62),transparent_58%)]" />
                  <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7"><p className="text-[10px] font-medium uppercase tracking-[0.19em] text-[#d7bc8f]">{gateway.eyebrow}</p><h2 className="font-display mt-2 max-w-[19ch] text-[clamp(1.5rem,3vw,2.45rem)] font-medium uppercase leading-[0.98] tracking-[-0.025em]">{gateway.title}</h2><p className="mt-3 max-w-[54ch] text-[12px] leading-[1.55] text-white/76 sm:text-[13px]">{gateway.description}</p><span className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-white">{gateway.action}<ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" /></span></div>
                </div>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} initial={init} animate="show" custom={5} className="order-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-[#14120F]/10 pt-5 lg:col-span-2">
            <div><p className="font-display text-[16px] font-medium text-[#14120F]">{c.site.doctor}</p><p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b6459]">{c.site.specialty}</p></div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#5f584d] sm:gap-x-8"><div><dt className="sr-only">{c.hero.open}</dt><dd>{c.site.hours.days} <span className="text-[#C0A578]">/</span> <span dir="ltr">{c.site.hours.time}</span></dd></div><div><dt className="sr-only">{c.hero.clinic}</dt><dd><a href={site.maps.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#14120F]"><MapPin className="h-3.5 w-3.5" />{c.site.address.short}</a></dd></div></dl>
            <div className="flex gap-2">{socials.map(({ key, href, Icon }) => <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={c.common[key]} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#14120F]/10 bg-white/45 text-[#3a352f] transition-colors hover:bg-white/75"><Icon className="h-4 w-4" /></a>)}</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
