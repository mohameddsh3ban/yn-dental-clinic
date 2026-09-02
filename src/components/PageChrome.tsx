import BackToTop from '@/components/BackToTop'
import FloatingNav from '@/components/FloatingNav'
import ScrollProgress from '@/components/ScrollProgress'

/**
 * Everything fixed to the viewport: the floating nav, the scroll hairline and
 * the back-to-top button. One lazy chunk, because none of it is needed until
 * the hero has scrolled away.
 */
export default function PageChrome() {
  return (
    <>
      <ScrollProgress />
      <FloatingNav />
      <BackToTop />
    </>
  )
}
