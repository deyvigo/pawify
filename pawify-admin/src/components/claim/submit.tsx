import { useStomp } from '@/context/stomp-context'
import { useState, type SubmitEventHandler } from 'react'

interface SubmitProps {
  conversationId: number
  onSend?: () => void
}

export const Submit = ({ conversationId, onSend }: SubmitProps) => {
  const [message, setMessage] = useState<string>('')

  const { publish } = useStomp()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    if (!message.trim() || !conversationId) return

    const body = {
      claim_id: conversationId,
      content: message.trim(),
    }
    publish('/app/claim.send', body)
    setMessage('')
    onSend?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-primary-accent text-white rounded-lg px-4 py-2.5 text-sm outline-none placeholder:text-subtitle"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="bg-linear-to-r from-start to-end rounded-lg px-5 py-2.5 cursor-pointer text-white text-sm font-medium disabled:opacity-40"
      >
        Enviar
      </button>
    </form>
  )
}
