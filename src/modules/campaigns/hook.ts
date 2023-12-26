import { useContext, useMemo } from 'react'
import { ProviderContext } from './context.ts'
import { ProviderContextValue } from './types.ts'

export const useCampaignContext = () => {
    const context = useContext(ProviderContext)
    if (context === undefined) {
        throw new Error('useCampaignProvider must be used within a CampaignProvider')
    }
    return context
}

export const useCampaignFilterContext = (): [boolean, ProviderContextValue] => {
    const context = useCampaignContext()

    const filtersApplied = useMemo(() => {
        return !(
            !context.state.filtersBy.searchBy &&
            !context.state.filtersBy.dateRange?.start &&
            !context.state.filtersBy.dateRange?.end
        )
    }, [
        context.state.filtersBy.dateRange?.end,
        context.state.filtersBy.dateRange?.start,
        context.state.filtersBy.searchBy,
    ])
    return [filtersApplied, context]
}
