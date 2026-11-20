import { en } from '../en'
import { pagesEn } from '../pages/en'
import { resolvePages } from '../pages'
import type { Bundle } from '../bundle'

const bundle: Bundle = { site: en, pages: resolvePages(pagesEn, en, 'en') }

export default bundle
