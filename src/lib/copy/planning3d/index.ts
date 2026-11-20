import type { Lang } from '@/lib/copy'
import type { PlanningCopy } from './types'
import { planningEn } from './en'
import { planningAr } from './ar'
import { planningFr } from './fr'
import { planningRu } from './ru'

/**
 * The 3D page's copy in every language. Imported only by the page itself, so
 * it travels in that page's chunk and nowhere else.
 */
export const planningCopy: Record<Lang, PlanningCopy> = {
  en: planningEn,
  ar: planningAr,
  fr: planningFr,
  ru: planningRu,
}
