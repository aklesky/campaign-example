import { useCallback, useEffect, useRef, useState } from 'react'

export type WorkerDispatcher<T = unknown, R = unknown> = [
    (data: T) => void,
    (listener: (event: MessageEvent<R>) => void) => () => void,
    () => void,
    error: ErrorEvent | null,
]

export const useWorker = <T = unknown, R = unknown>(worker: Worker, autoTerminate = true): WorkerDispatcher<T, R> => {
    const listenersRef = useRef<((event: MessageEvent<R>) => void)[]>([])
    const workerRef = useRef<Worker | null>(worker)
    const [error, setError] = useState<ErrorEvent | null>(null)

    const messageEventHandler = useCallback((event: MessageEvent<R>) => {
        listenersRef.current.forEach(listener => listener(event))
    }, [])

    const errorEventHandler = useCallback((event: ErrorEvent) => {
        setError(event)
    }, [])

    useEffect(() => {
        const currentWorker = workerRef.current
        currentWorker?.addEventListener('message', messageEventHandler)
        currentWorker?.addEventListener('error', errorEventHandler)
        return () => {
            if (autoTerminate) {
                currentWorker?.terminate()
            }
            currentWorker?.removeEventListener('message', messageEventHandler)
            currentWorker?.removeEventListener('error', errorEventHandler)
        }
    }, [autoTerminate, errorEventHandler, messageEventHandler])

    const dispatch = useCallback((data: T) => {
        try {
            workerRef.current?.postMessage(data)
        } catch (err) {
            console.error('failed to dispatch message to worker:', err)
        }
    }, [])

    const subscribe = useCallback((listener: (event: MessageEvent<R>) => void) => {
        listenersRef.current.push(listener)
        return () => {
            listenersRef.current = listenersRef.current.filter(l => l !== listener)
        }
    }, [])
    const terminate = useCallback(() => {
        workerRef.current?.terminate()
        workerRef.current = null
    }, [])

    return [dispatch, subscribe, terminate, error]
}
