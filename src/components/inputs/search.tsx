import React, { InputHTMLAttributes, memo, useCallback, useEffect, useState } from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import useDebounce from '../../hooks/debounce.js'
import { labels } from '../../i18n.js'

export type SearchProps = InputHTMLAttributes<HTMLInputElement> & { onSearchCallback: (value: InputType) => void }

const SearchInputView = (props: SearchProps) => {
    const [searchTerm, setSearchTerm] = useState(props.defaultValue || '')
    const [isFocused, setIsFocused] = useState(false) // New state to track focus
    const [value] = useDebounce(searchTerm, 500)

    const onKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        setSearchTerm(e.currentTarget.value)
    }, [])

    useEffect(() => {
        if (isFocused && (value || value === '')) {
            props.onSearchCallback(value)
        }
    }, [props, value, isFocused]) // Include isFocused in the dependency array

    const onFocus = () => setIsFocused(true)
    const onBlur = () => setIsFocused(false)

    return (
        <div className="relative w-full">
            <label className="sr-only">{labels.search}</label>
            <input
                defaultValue={props.defaultValue}
                onKeyUp={onKeyUp}
                onFocus={onFocus}
                onBlur={onBlur}
                type="text"
                name="search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={props.placeholder || labels.searchPlaceholder}
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                <HiMagnifyingGlass size={16} />
            </div>
        </div>
    )
}

export const Search = memo(SearchInputView)

export default Search
