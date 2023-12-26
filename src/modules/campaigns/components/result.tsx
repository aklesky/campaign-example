import { Kbd } from 'flowbite-react'
import { memo } from 'react'
import { FaFilterCircleXmark } from 'react-icons/fa6'
import { labels } from '../../../i18n.ts'
import { useCampaignFilterContext } from '../hook.ts'

const ResultView = () => {
    const [visible, context] = useCampaignFilterContext()

    if (!visible) {
        return null
    }
    return (
        <div className="flex space-x-1 place-items-start md:place-items-center flex-col md:flex-row">
            <h4 className="text-gray-500 dark:text-gray-400 place-items-center flex">
                {labels.filteredBy}
                <button
                    className="overflow-y-auto text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                    type="button"
                    onClick={context.onClearFilters}
                >
                    <FaFilterCircleXmark size="16" color="red" />
                </button>
            </h4>
            <p className="flex space-x-0 space-y-1 py-0.5 flex-col md:flex-row md:space-x-1 md:space-y-0">
                <>
                    {context.state.filtersBy.searchBy && <Kbd>{context.state.filtersBy.searchBy}</Kbd>}
                    {context.state.filtersBy.dateRange?.start && context.state.filtersBy.dateRange.end && (
                        <Kbd>
                            {context.state.filtersBy.dateRange.start} - {context.state.filtersBy.dateRange.end}
                        </Kbd>
                    )}
                </>
            </p>
        </div>
    )
}

export const Result = memo(ResultView)

export default Result
