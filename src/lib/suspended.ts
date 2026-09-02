/**
 * Service suspension switch.
 *
 * While this is true the site serves nothing but the hero — blurred, inert and
 * unscrollable — behind a notice saying the hosting bill is unpaid. Every
 * section, route and piece of page chrome is still in the repository untouched:
 * flip this to false and the full site is back exactly as it was.
 */
export const SITE_SUSPENDED = true

/**
 * Optional link on the notice's button (a WhatsApp deep link, a mailto: or an
 * invoice URL). Left empty the button is not rendered, so the notice never
 * points at a contact that does not exist.
 */
export const PAY_CONTACT_URL = ''
