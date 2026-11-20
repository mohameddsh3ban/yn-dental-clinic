import { ar } from '../ar'
import { pagesAr } from '../pages/ar'
import { resolvePages } from '../pages'
import type { Bundle } from '../bundle'

const bundle: Bundle = { site: ar, pages: resolvePages(pagesAr, ar, 'ar') }

export default bundle
