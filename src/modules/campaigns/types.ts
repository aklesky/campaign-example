export interface ProviderState {
    data?: Item[]
    loading: boolean
    total: number
    count: number
    currentPage: number
    filtersBy: FilteredBy
}

export type ActionType = { type: string; payload?: StorageMessageEvent }

export type ReduceType = (prevState: ProviderState, action: ActionType) => ProviderState

export interface ProviderContextValue {
    state: ProviderState
    onPageChange: (page: number) => void
    onFilterByDate: (range: FilterByDateRange) => void
    onSearchBy: (search: InputType) => void
    onClearFilters: () => void
}

export interface CampaignProviderProps {
    worker: Worker
}

export enum DispatchActionType {
    Add = 'add',
    SearchBy = 'searchBy',
    FilterBy = 'filterBy',
    Paginate = 'paginate',
    Init = 'init',
    Reset = 'reset',
    Update = 'update',
}
