import { useEffect } from 'react'

/**
 * Owns `<title>` and the description meta for as long as a page is mounted.
 *
 * A page, not the language provider, sets these. The provider is an ancestor,
 * and React runs a parent's effects after its children's, so a provider that
 * wrote the title would overwrite whatever the doctor profile had just set —
 * silently, and only on the profile routes. One owner, at the leaf.
 *
 * Both values are language-dependent, so passing them straight from the
 * dictionary is enough to keep the tab in step with the language toggle.
 */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    const prevTitle = document.title
    const prevDesc = meta?.getAttribute('content') ?? null

    document.title = title
    meta?.setAttribute('content', description)

    return () => {
      document.title = prevTitle
      if (meta && prevDesc !== null) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
