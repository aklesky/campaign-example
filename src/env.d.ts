export {}

declare global {
    declare const DATE_FORMAT: string
    declare const DATE_PARSE_SEPARATOR: string
    declare const TABLE_PAGE_SIZE: string
    interface Item {
        id: number
        name: string
        active: boolean
        startDate: string
        endDate: string
        budget: number
    }
    interface StorageState {
        limit: number
        storage: Item[]
        state: Item[]
        filtersBy: FilteredBy
        count: number
        currentPage: number
        total: number
    }

    interface FilterByDateRange {
        start: string
        end: string
    }

    interface FilteredBy {
        dateRange?: FilterByDateRange
        searchBy?: InputType
    }

    interface StorageDispatchEvent {
        type: string
        state?: Item[]
        filtersBy?: FilteredBy
        nextPage?: number
        range?: FilterByDateRange
    }

    interface StorageMessageEvent {
        type: string
        state?: Item[]
        count?: number
        total?: number
        currentPage?: number
        filtersBy?: FilteredBy
    }

    export type InputType = string | number | readonly string[]

    interface Window {
        addCampaigns: (campaigns: Item[]) => void
    }
}
