import { ForwardedRef, forwardRef, memo } from 'react'
import DatePicker from '../../../components/datepicker/datepicker.tsx'
import Search from '../../../components/inputs/search.tsx'
import { labels } from '../../../i18n.ts'
import { useCampaignContext } from '../hook.ts'

const FiltersView = forwardRef((props: { dateFormat: string }, ref: ForwardedRef<HTMLDivElement>) => {
    const context = useCampaignContext()
    return (
        <>
            <h4 className="text-left">{labels.filterBy}</h4>
            <div ref={ref} className="flex flex-col md:flex-row space-y-1.5 md:space-x-1.5 md:space-y-0 my-4">
                <Search onSearchCallback={context.onSearchBy} defaultValue={context.state.filtersBy.searchBy} />
                <DatePicker
                    onChangeDateCallback={context.onFilterByDate}
                    format={props.dateFormat}
                    dateRangeValue={context.state.filtersBy.dateRange}
                />
            </div>
        </>
    )
})

export const Filters = memo(FiltersView)

export default Filters
