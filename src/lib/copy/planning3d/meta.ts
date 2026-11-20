import type { Lang } from '@/lib/copy'
import type { PlanningMeta } from './types'

export const planningMeta: Record<Lang, PlanningMeta> = {
  en: {
    nav: 'Face and jaw 3D guide',
    blurb: 'Explore questions about profile, bite and facial balance in a 3D reference model.',
    metaTitle: 'Face, Bite & Jaw Questions — Interactive 3D Guide | Ozea, Cairo',
    metaDescription:
      'An educational interactive guide for questions about facial profile, bite and facial asymmetry. Explore a 3D skull and learn what a maxillofacial consultation may discuss. Ozea Dental Clinic, Cairo.',
  },
  ar: {
    nav: 'دليل الوجه والفكين ثلاثي الأبعاد',
    blurb: 'استكشف أسئلة عن ملامح الوجه والإطباق وتوازن الوجه في نموذج مرجعي ثلاثي الأبعاد.',
    metaTitle: 'أسئلة عن الوجه والإطباق والفكين — دليل تفاعلي ثلاثي الأبعاد | Ozea، القاهرة',
    metaDescription:
      'دليل تعليمي تفاعلي لمن لديه أسئلة عن ملامح الوجه أو الإطباق أو عدم تماثل الوجه. استكشف نموذجًا ثلاثي الأبعاد وتعرّف على ما قد يُناقش في كشف جراحة الوجه والفكين في عيادة Ozea بالقاهرة.',
  },
  fr: {
    nav: 'Guide 3D du visage et des mâchoires',
    blurb: 'Explorez des questions sur le profil, l’occlusion et l’équilibre du visage avec un modèle 3D de référence.',
    metaTitle: 'Questions sur le visage, l’occlusion et les mâchoires — guide 3D | Ozea, Le Caire',
    metaDescription:
      'Un guide interactif à visée éducative pour les questions de profil, d’occlusion et d’asymétrie du visage. Explorez un crâne 3D et découvrez ce qui peut être discuté lors d’une consultation maxillo-faciale. Ozea Dental Clinic, Le Caire.',
  },
  ru: {
    nav: '3D-гид по лицу и челюстям',
    blurb: 'Изучите вопросы о профиле, прикусе и пропорциях лица на справочной 3D-модели.',
    metaTitle: 'Вопросы о лице, прикусе и челюстях — интерактивный 3D-гид | Ozea, Каир',
    metaDescription:
      'Образовательный интерактивный гид для вопросов о профиле, прикусе и асимметрии лица. Изучите 3D-модель черепа и узнайте, что может обсуждаться на консультации челюстно-лицевого хирурга. Ozea Dental Clinic, Каир.',
  },
}
