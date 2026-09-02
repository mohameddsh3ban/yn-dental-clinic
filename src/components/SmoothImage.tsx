import { useCallback, useState, type ImgHTMLAttributes } from 'react'
import { snap } from '@/lib/anim'
import { cn } from '@/lib/utils'

/**
 * A photograph that arrives rather than pops.
 *
 * The frame paints a tiny blurred copy of the image the moment it mounts, and
 * the photograph itself fades up over it once the bytes have landed. On a fast
 * connection the two are indistinguishable; on a slow one the card has a
 * colour and a shape from the first frame instead of a hole.
 *
 * `?snap=1` captures render the loaded state immediately, and a cached image
 * that completed before React attached its listener is caught on mount.
 */
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  /** Data URI painted behind the photograph while it loads. */
  blur?: string
  /** Applied to the frame that carries the blurred ground. */
  frameClassName?: string
}

export function SmoothImage({ src, blur, className, frameClassName, alt, onLoad, ...rest }: Props) {
  const [loaded, setLoaded] = useState(snap)

  // A cached image can be complete before React attaches the onLoad listener;
  // the callback ref runs at commit, when the element exists, and catches it.
  const attach = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <span
      className={cn('relative block overflow-hidden', frameClassName)}
      style={
        blur
          ? { backgroundImage: `url("${blur}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined
      }
    >
      <img
        ref={attach}
        src={src}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...rest}
      />
    </span>
  )
}
