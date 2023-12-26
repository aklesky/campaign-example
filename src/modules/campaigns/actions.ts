import { DispatchActionType } from './types.ts'

export const onFilterByDateRangeAction = (range: FilterByDateRange): StorageDispatchEvent => {
    return {
        type: DispatchActionType.FilterBy,
        filtersBy: {
            dateRange: {
                ...(range || {}),
            },
        },
    }
}

export const onSearchByAction = (searchBy: InputType): StorageDispatchEvent => {
    return {
        type: DispatchActionType.SearchBy,
        filtersBy: {
            searchBy,
        },
    }
}

export const onPaginateAction = (nextPage: number): StorageDispatchEvent => {
    return {
        type: DispatchActionType.Paginate,
        nextPage,
    }
}

export const onInitAction = (initial: Item[]): StorageDispatchEvent => {
    return {
        type: DispatchActionType.Init,
        state: initial,
    }
}

export const onResetAction = (): StorageDispatchEvent => {
    return {
        type: DispatchActionType.Reset,
    }
}
