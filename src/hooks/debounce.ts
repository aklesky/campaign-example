import { useState, useEffect, useCallback } from 'react'

export type DebounceType = (input: InputType, delay: number) => [InputType, () => void]

export const useDebounce: DebounceType = (input: InputType, delay: number) => {
    const [value, setValue] = useState(input)
    const [initial, setInitial] = useState(true)

    const cancelDebounce = useCallback(() => {
        setValue(value)
    }, [value])

    useEffect(() => {
        if (initial) {
            setInitial(false)
            return
        }

        const handler = setTimeout(() => {
            setValue(input)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [input, delay, initial])

    return [value, cancelDebounce]
}

export default useDebounce
