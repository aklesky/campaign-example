import DateRangePicker from 'flowbite-datepicker/DateRangePicker'
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { HiCalendarDays } from 'react-icons/hi2'
import { labels } from '../../i18n.ts'

const DateRangePickerView = (props: {
    onChangeDateCallback: (range: FilterByDateRange) => void
    format: string
    dateRangeValue?: FilterByDateRange
}) => {
    const elementRef = useRef<HTMLDivElement>(null)
    const startRef = useRef<HTMLInputElement>(null)
    const endRef = useRef<HTMLInputElement>(null)
    const [, setState] = useState({ start: '', end: '' })

    const onChangeDate = useCallback(
        (e: Event) => {
            const event = e as unknown as ChangeEvent<HTMLInputElement>
            setState(prevState => {
                const next = { ...prevState, [event.target.name]: event.target.value }
                props.onChangeDateCallback({ start: next.start, end: next.end })
                return next
            })
        },
        [props],
    )

    useEffect(() => {
        const root = elementRef.current
        const dateTo = endRef.current
        const dateFrom = startRef.current
        let range: typeof DateRangePicker = null
        if (root) {
            range = new DateRangePicker(root, {
                format: props.format,
            })
            range.setDates(props.dateRangeValue?.start, props.dateRangeValue?.end)
        }
        if (dateTo) {
            dateTo.addEventListener('changeDate', onChangeDate)
        }
        if (dateFrom) {
            dateFrom.addEventListener('changeDate', onChangeDate)
        }

        return () => {
            if (dateTo) {
                dateTo.removeEventListener('changeDate', onChangeDate)
            }
            if (dateFrom) {
                dateFrom.removeEventListener('changeDate', onChangeDate)
            }
            range.destroy()
        }
    }, [onChangeDate, elementRef, props.format, props.dateRangeValue?.start, props.dateRangeValue?.end])

    return (
        <div ref={elementRef} className="flex items-center space-x-1.5 w-full">
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <HiCalendarDays />
                </div>
                <input
                    defaultValue={props.dateRangeValue?.start || ''}
                    ref={startRef}
                    name="start"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={labels.startDate}
                />
            </div>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <HiCalendarDays />
                </div>
                <input
                    defaultValue={props.dateRangeValue?.end || ''}
                    ref={endRef}
                    name="end"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={labels.endDate}
                />
            </div>
        </div>
    )
}

export const DatePicker = memo(DateRangePickerView)

export default DatePicker
