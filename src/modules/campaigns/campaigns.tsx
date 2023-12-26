import { Pagination } from 'flowbite-react'
import { lazy, memo, useRef } from 'react'
import { labels } from '../../i18n.ts'
import FilterDrawer from './components/drawer.tsx'
import Result from './components/result.tsx'
import CampaignsListBody from './containers/table/body.tsx'
import { CampaignsListView } from './containers/table/table.tsx'
import { useCampaignContext } from './hook.ts'
import './styles/styles.scss'

const Filters = lazy(() => import('./components/filters.tsx'))

const CampaignsView = () => {
    const ref = useRef<HTMLDivElement>(null)

    const { state, onPageChange } = useCampaignContext()
    if (state.loading) {
        return null
    }
    return (
        <div className="py-1">
            <div className="my-2 flex justify-between place-items-start md:place-items-center">
                <div className="px-1.5">
                    <p className="text-gray-500 dark:text-gray-400">
                        {labels.total}
                        {state.total}
                    </p>
                    <Result />
                </div>
                <FilterDrawer el={ref}>
                    <Filters dateFormat={DATE_FORMAT} ref={ref} />
                </FilterDrawer>
            </div>
            <div className="flex flex-col space-y-1.5">
                <CampaignsListView
                    headers={[labels.name, labels.status, labels.startDate, labels.endDate, labels.budget]}
                >
                    <CampaignsListBody data={state.data} />
                </CampaignsListView>
                <div className="overflow-x-auto">
                    <div className="px-1.5 text-gray-500 dark:text-gray-400">
                        {labels.totalPages}
                        {state.count}
                    </div>
                    <Pagination
                        className="campaigns__paginate"
                        currentPage={state.currentPage}
                        onPageChange={onPageChange}
                        totalPages={state.count}
                        showIcons
                    />
                </div>
            </div>
        </div>
    )
}

export const Campaigns = memo(CampaignsView)

export default Campaigns
