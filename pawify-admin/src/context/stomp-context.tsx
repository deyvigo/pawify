import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { WS_URL } from '@/services/api'

type SubscribeCallback = (message: IMessage) => void

interface StompContextValue {
  connected: boolean
  subscribe: (destination: string, callback: SubscribeCallback) => StompSubscription | null
  publish: (destination: string, body: unknown) => void
}

const StompContext = createContext<StompContextValue | null>(null)

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState<boolean>(false)

  const clientRef = useRef<Client | null>(null)
  const { token } = useAuthContext()

  useEffect(() => {
    const client = new Client({
      brokerURL: `${WS_URL}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onStompError: (frame: IFrame) => console.error('STOMP error: ', frame),
      debug: str => console.log('STOMP debug:', str),
      reconnectDelay: 1000,
    })

    client.activate()
    clientRef.current = client

    return () => void client.deactivate()
  }, [])

  const subscribe = useCallback((destination: string, callback: SubscribeCallback) => {
    if (!clientRef.current) return null
    return clientRef.current.subscribe(destination, callback)
  }, [])

  const publish = useCallback((destination: string, body: unknown) => {
    if (!clientRef.current) return
    clientRef.current.publish({ destination, body: JSON.stringify(body) })
  }, [])

  return <StompContext.Provider value={{ connected, subscribe, publish }}>{children}</StompContext.Provider>
}

export const useStomp = () => {
  const context = useContext(StompContext)
  if (!context) {
    throw new Error('useStomp must be used within a StompProvider')
  }
  return context
}
