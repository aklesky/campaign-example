import { memo, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react'
import { useWorker } from '../../hooks/worker.js'
import { resourceable } from '../../utils/resource.js'
import {
    onFilterByDateRangeAction,
    onInitAction,
    onPaginateAction,
    onResetAction,
    onSearchByAction,
} from './actions.ts'
import { ProviderContext } from './context.js'
import { initialState, reducer } from './reducer.js'
import { CampaignProviderProps } from './types.ts'

const resource = resourceable<Item[]>(() =>
    import('../../../mock/seed.json')
        .then(response => response.default || response)
        .then(response => {
            return () => response
        }),
)

const CampaignProviderView = (props: PropsWithChildren<CampaignProviderProps>) => {
    const { worker } = props
    const [post, subscribe] = useWorker<StorageDispatchEvent, StorageMessageEvent>(worker, false)
    const initial = resource.read()
    const [state, dispatch] = useReducer(reducer, initialState)

    const onSubscribe = useCallback((e: MessageEvent<StorageMessageEvent>) => {
        dispatch({ type: e.data.type, payload: e.data })
    }, [])

    useEffect(() => {
        if (!state.data || !state.data?.length) {
            post(onInitAction(initial))
        }
        const unsubscribe = subscribe(onSubscribe)
        return () => {
            unsubscribe()
        }
    }, [initial, onSubscribe, post, state.data, subscribe])

    const onFilterByDate = useCallback(
        (range: FilterByDateRange) => {
            post(onFilterByDateRangeAction(range))
        },
        [post],
    )

    const onSearchBy = useCallback(
        (search: InputType) => {
            post(onSearchByAction(search))
        },
        [post],
    )

    const onPageChange = useCallback(
        (page: number) => {
            post(onPaginateAction(page))
        },
        [post],
    )
    const onClearFilters = useCallback(() => {
        post(onResetAction())
    }, [post])

    const value = useMemo(
        () => ({
            state,
            onPageChange,
            onFilterByDate,
            onSearchBy,
            onClearFilters,
        }),
        [onClearFilters, onFilterByDate, onPageChange, onSearchBy, state],
    )
    return <ProviderContext.Provider value={value}>{!state.loading && props.children}</ProviderContext.Provider>
}

export const CampaignProvider = memo(CampaignProviderView)

export default CampaignProvider
