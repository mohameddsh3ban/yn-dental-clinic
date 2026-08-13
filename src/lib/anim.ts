// Test/screenshot helpers: ?snap=1 renders final animation states instantly,
// ?flat=1 relaxes viewport-height sizing (used for full-page captures).
export const snap =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('snap')

export const flat =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('flat')
