import { fr } from '../fr'
import { pagesFr } from '../pages/fr'
import { resolvePages } from '../pages'
import type { Bundle } from '../bundle'

const bundle: Bundle = { site: fr, pages: resolvePages(pagesFr, fr, 'fr') }

export default bundle
