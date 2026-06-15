import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react'

interface ScrollTriggerWrapperProps {
  children: ReactNode
  onReachBottom?: () => void
  onReachTop?: () => void
  bottomThreshold?: number
  topThreshold?: number
  className?: string
  reversed?: boolean // 👈 nuevo prop
}

export interface ScrollTriggerRef {
  scrollToTop: () => void
  scrollToBottom: () => void
  scrollToTopInstantly: () => void
  scrollToBottomInstantly: () => void
}

export const ScrollTriggerWrapper = forwardRef<ScrollTriggerRef, ScrollTriggerWrapperProps>(
  (
    {
      children,
      onReachBottom,
      onReachTop,
      bottomThreshold = 100,
      topThreshold = 100,
      className = '',
      reversed = false, // 👈
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      },
      scrollToBottom: () => {
        const el = containerRef.current
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      },
      scrollToTopInstantly: () => {
        containerRef.current?.scrollTo({ top: 0, behavior: 'instant' })
      },
      scrollToBottomInstantly: () => {
        const el = containerRef.current
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'instant' })
      },
    }))

    const handleScroll = useCallback(() => {
      const el = containerRef.current
      if (!el) return

      const { scrollTop, scrollHeight, clientHeight } = el

      // Firefox puede dar scrollTop negativo con flex-col-reverse
      // Normalizamos: distancia desde el tope del DOM
      const normalizedTop = Math.abs(scrollTop)
      const normalizedBottom = scrollHeight - clientHeight - normalizedTop

      if (reversed) {
        // Con flex-col-reverse:
        // - "tope visual" (mensajes nuevos) = scrollTop ≈ 0  → normalizedTop ≈ 0
        // - "fondo visual" (mensajes viejos) = scrollTop ≈ max → normalizedBottom ≈ 0
        if (onReachTop && normalizedTop <= topThreshold) {
          onReachTop()
        }
        if (onReachBottom && normalizedBottom <= bottomThreshold) {
          onReachBottom()
        }
      } else {
        if (onReachTop && normalizedTop <= topThreshold) {
          onReachTop()
        }
        if (onReachBottom && normalizedBottom <= bottomThreshold) {
          onReachBottom()
        }
      }
    }, [onReachBottom, onReachTop, bottomThreshold, topThreshold, reversed])

    useEffect(() => {
      const el = containerRef.current
      if (!el) return

      let timeout: ReturnType<typeof setTimeout>
      const debouncedScroll = () => {
        clearTimeout(timeout)
        timeout = setTimeout(handleScroll, 200)
      }

      el.addEventListener('scroll', debouncedScroll)
      return () => {
        el.removeEventListener('scroll', debouncedScroll)
        clearTimeout(timeout)
      }
    }, [handleScroll])

    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    )
  },
)
