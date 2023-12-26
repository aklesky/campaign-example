import { Drawer } from 'flowbite'
import { memo, PropsWithChildren, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import { HiX } from 'react-icons/hi'
import { useClickOutside } from '../../../hooks/outside.ts'
import { labels } from '../../../i18n.ts'

const FilterDrawerView = (props: PropsWithChildren<{ el: RefObject<Element> }>) => {
    const elementRef = useRef<HTMLDivElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const drawerRef = useRef<Drawer>()
    const [state, setState] = useState(false)

    const onOpen = useCallback(() => {
        if (!state) {
            drawerRef.current?.show()
        }

        setState(prev => !prev)
    }, [state])

    const onClose = useCallback(() => {
        if (state && drawerRef.current?.isVisible()) {
            setState(prev => {
                drawerRef.current?.hide()
                return !prev
            })
        }
    }, [state])

    const onCloseOutside = useCallback(
        (event: Event) => {
            if (
                !(event.target as HTMLElement).closest('#campaigns-filters') &&
                !(event.target as HTMLElement).closest('.datepicker')
            ) {
                onClose()
            }
        },
        [onClose],
    )

    useClickOutside(props.el, onCloseOutside)

    useEffect(() => {
        drawerRef.current = new Drawer(elementRef.current, {
            placement: 'top',
            backdrop: false,
            bodyScrolling: true,
        })

        return () => {
            drawerRef.current?.destroy()
        }
    }, [])

    return (
        <div ref={rootRef} id="campaigns-filters">
            <button
                className="overflow-y-auto text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                type="button"
                onClick={onOpen}
            >
                <FaFilter size="16" />
            </button>
            <div
                ref={elementRef}
                className="fixed top-0 left-0 right-0 z-40 w-full transition-transform -translate-y-full bg-white dark:bg-gray-800"
                tabIndex={-1}
            >
                <div className="overflow-y-auto container mx-auto text-right">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-controls="drawer-top-close"
                        className="text-gray-400 mt-2 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm px-3 py-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <HiX size={16} />
                        <span className="sr-only">{labels.close}</span>
                    </button>
                    {state && (
                        <div className="container mx-auto text-sm text-gray-500 dark:text-gray-400 px-2">
                            {props.children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export const FilterDrawer = memo(FilterDrawerView)

export default FilterDrawer
