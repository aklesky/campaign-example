import { DispatchActionType, ProviderState, ReduceType } from './types.ts'

export const initialState: ProviderState = {
    data: [],
    loading: true,
    currentPage: 1,
    total: 0,
    count: 0,
    filtersBy: {
        searchBy: '',
        dateRange: {
            start: '',
            end: '',
        },
    },
}

export const reducer: ReduceType = (state = initialState, action) => {
    switch (action.type) {
        case DispatchActionType.Init: {
            return {
                ...state,
                data: [...(state?.data || []), ...(action.payload?.state || [])],
                loading: false,
                total: action.payload?.total || 0,
                count: action.payload?.count || 0,
            }
        }
        case DispatchActionType.Update: {
            return {
                ...state,
                data: action.payload?.state || [],
                loading: false,
                total: action.payload?.total || 0,
                count: action.payload?.count || 0,
                currentPage: action.payload?.currentPage || 1,
                filtersBy: action.payload?.filtersBy || state.filtersBy,
            }
        }
        default: {
            return state
        }
    }
}
