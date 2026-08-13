// Single source of truth for clinic identity and contact details.
// Update here — every section reads from this module.

const WHATSAPP_MESSAGE =
  "Hello Dr. Youssef Nasser, I'd like to book an appointment at YN Dental Clinic."

export const site = {
  name: 'YN Dental Clinic',
  short: 'YN',
  doctor: 'Dr. Youssef Nasser',
  specialty: 'Dental Implants & Maxillofacial Surgery',

  instagram: 'https://www.instagram.com/dr.youssefnasser_',
  instagramHandle: '@dr.youssefnasser_',

  /** First number is the WhatsApp line. */
  phones: [
    { label: '+20 106 979 9460', tel: '+201069799460' },
    { label: '+20 110 738 1860', tel: '+201107381860' },
  ],

  whatsapp: `https://wa.me/201069799460?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,

  address: {
    street: '6 Mahmoud Ammar, Al Golf',
    city: 'Nasr City, Cairo Governorate',
    short: 'Nasr City, Cairo',
  },

  hours: {
    days: 'Mon – Sat',
    time: '09 AM – 16 PM',
  },

  maps: {
    link: 'https://maps.app.goo.gl/33yMJCLWxvj25xks9',
    embed:
      'https://www.google.com/maps?q=Dr.Youssef+Nasser+Dental+implant+and+maxillofacial+surgery,+6+Mahmoud+Ammar,+Al+Golf,+Nasr+City,+Cairo+Governorate+4451421&z=16&output=embed',
  },
} as const
