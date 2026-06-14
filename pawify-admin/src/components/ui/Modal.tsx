import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '../icons/CloseIcon'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  closeOnBackDrop?: boolean
  closeOnEsc?: boolean
  children: ReactNode
  className?: string
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  closeOnBackDrop = true,
  closeOnEsc = true,
  children,
  className
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstFocusableElement = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!closeOnEsc) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, closeOnEsc])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) firstFocusableElement.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackDrop && event.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      role='dialog'
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'
    >
      <div
        className={className}
      >
        <div className='flex items-center justify-between bg-primary-accent px-6 py-4 border-b border-primary-border'>
          <span className='text-white text-lg font-medium'>{title}</span>
          <button
            onClick={onClose}
            className='rounded-full p-1.5 hover:bg-primary transition-colors cursor-pointer'
          >
            <CloseIcon className='w-5 h-5 text-subtitle hover:text-white transition-colors' />
          </button>
        </div>
        { children }
      </div>
    </div>,
    document.body
  )
}