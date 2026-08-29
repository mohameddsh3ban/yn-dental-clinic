// Single source of truth for the clinic's language-independent details:
// numbers, handles and links. Everything with words in it — the clinic name,
// the doctor's name, the address, the opening hours — lives in `lib/copy`, so
// the Arabic site is not quietly serving English strings.

export const site = {
  instagram: 'https://www.instagram.com/dr.youssefnasser_',
  instagramHandle: '@dr.youssefnasser_',

  /** First number is the WhatsApp line. */
  phones: [
    { label: '+20 106 979 9460', tel: '+201069799460' },
    { label: '+20 110 738 1860', tel: '+201107381860' },
  ],

  maps: {
    link: 'https://maps.app.goo.gl/33yMJCLWxvj25xks9',
    embed:
      'https://www.google.com/maps?q=Dr.Youssef+Nasser+Dental+implant+and+maxillofacial+surgery,+6+Mahmoud+Ammar,+Al+Golf,+Nasr+City,+Cairo+Governorate+4451421&z=16&output=embed',
  },
} as const

/** The WhatsApp deep link, carrying an opening message in the visitor's language. */
export function whatsappUrl(message: string): string {
  const number = site.phones[0].tel.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
