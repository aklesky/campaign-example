import { RefObject, useCallback, useEffect } from 'react'

const defaultEvents = ['mousedown', 'touchstart', 'click']
export const useClickOutside = (
    element: RefObject<Element> | null,
    callback: (event: Event) => void,
    events = defaultEvents,
) => {
    const onEventHandler = useCallback(
        (event: Event) => {
            if (!element?.current) {
                return
            }
            const { current } = element
            if (current && event.target && !current.contains(event.target as Element)) {
                if (callback && typeof callback === 'function') {
                    callback(event)
                }
            }
        },
        [callback, element],
    )

    useEffect(() => {
        if (events && Array.isArray(events)) {
            events.forEach(event => {
                window.addEventListener(event, onEventHandler, false)
            })
        }
        return () => {
            if (events && Array.isArray(events)) {
                events.forEach(event => {
                    window.removeEventListener(event, onEventHandler, false)
                })
            }
        }
    }, [callback, events, onEventHandler])
}
