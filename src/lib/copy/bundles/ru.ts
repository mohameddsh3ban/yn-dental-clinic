import { ru } from '../ru'
import { pagesRu } from '../pages/ru'
import { resolvePages } from '../pages'
import type { Bundle } from '../bundle'

const bundle: Bundle = { site: ru, pages: resolvePages(pagesRu, ru, 'ru') }

export default bundle
