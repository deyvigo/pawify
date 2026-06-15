import { formatDateCompact, formatDateTime } from '@/utils/date'

interface MessageBubbleProps {
  message: string
  side: 'left' | 'right'
  name: string
  time: string
}

export const MessageBubble = ({ message, side, name, time }: MessageBubbleProps) => {
  return (
    <div className={`flex ${side === 'left' ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-md rounded-lg px-4 py-2.5 ${
          side === 'left' ? 'bg-start/20 text-white rounded-br-sm' : 'bg-primary-accent text-white rounded-bl-sm'
        }`}
      >
        <p className="text-sm">{message}</p>
        <div className="flex justify-end">
          <span className={`text-xs mt-1 block ${side === 'left' ? 'text-white/50 text-right' : 'text-subtitle'}`}>
            {formatDateCompact(time)}
          </span>
        </div>
      </div>
    </div>
  )
}
