enum ActionTypes {
    ADD = 'add',
    SEARCH = 'searchBy',
    FILTER = 'filterBy',
    INIT = 'init',
    RESET = 'reset',
    PAGINATE = 'paginate',
    UPDATE = 'update',
}

const initialState: StorageState = {
    limit: parseInt(TABLE_PAGE_SIZE, 10),
    storage: [] as Item[],
    state: [] as Item[],
    filtersBy: {
        searchBy: '',
        dateRange: {
            start: '',
            end: '',
        },
    },
    count: 0,
    currentPage: 1,
    total: 0,
}

let currentState = initialState

onmessage = function (e: MessageEvent<StorageDispatchEvent>) {
    if (!e.data.type || !isActionType(e.data.type)) {
        return
    }

    const { type } = e.data

    if (type === ActionTypes.INIT && isNotEmptyArray(e.data.state)) {
        const { state } = e.data
        if (!isNotEmptyArray(currentState.storage)) {
            const totalPages = getTotalPages(state)
            const next = updateState(e.data, {
                storage: state,
                state: sortByStartDate(state),
                total: state.length,
                count: totalPages,
            })
            notify(onInitAction(next))
        }

        return
    }
    if (type === ActionTypes.ADD) {
        if (!isNotEmptyArray(e.data.state)) {
            return
        }
        const { state } = e.data
        const store = [...(currentState.storage || []), ...(state || [])]
        let next = updateState(e.data, {
            storage: store,
            total: store.length,
        })

        let current: Item[] = next.storage

        if (currentState.filtersBy.searchBy) {
            const {
                filtersBy: { searchBy },
            } = currentState
            current = filterByName(next.storage, searchBy)
        }
        if (currentState.filtersBy.dateRange?.start && currentState.filtersBy.dateRange?.end) {
            const {
                filtersBy: { dateRange },
            } = currentState
            current = filterByDateRange(current, dateRange.start, dateRange.end)
        }

        current = sortByStartDate(current)

        next = updateState(e.data, {
            state: current,
        })

        current = current?.slice(0, currentState.limit)

        notify(onAddAction(next, current))
        return
    }
    if (type === ActionTypes.SEARCH) {
        if (e.data.filtersBy?.searchBy == currentState.filtersBy.searchBy) {
            return
        }
        const { filtersBy } = e.data
        let result = currentState.storage

        if (currentState.filtersBy.dateRange?.start && currentState.filtersBy.dateRange?.end) {
            const {
                filtersBy: { dateRange },
            } = currentState
            result = filterByDateRange(result, dateRange.start, dateRange.end)
        }
        if (filtersBy?.searchBy) {
            result = filterByName(result, filtersBy?.searchBy || '')
        }

        const current = result?.slice(0, currentState.limit)
        const next = updateState(e.data, {
            state: result,
        })
        notify(onUpdateAction(next, current))
        return
    }
    if (type === ActionTypes.RESET) {
        const current = currentState.storage.slice(0, 10)
        const next = updateState(e.data, {
            ...initialState,
            state: current,
            count: getTotalPages(currentState.storage),
            filtersBy: {
                searchBy: '',
                dateRange: {
                    start: '',
                    end: '',
                },
            },
        })

        notify(onResetAction(next))
        return
    }
    if (type === ActionTypes.PAGINATE) {
        const { nextPage } = e.data
        const start = ((nextPage || 1) - 1) * currentState.limit
        const end = Math.min(start + currentState.limit, currentState.state.length)
        const current = currentState.state.slice(start, end)
        notify(
            onPaginateAction({
                state: current,
                currentPage: nextPage || 1,
            }),
        )
        return
    }
    if (type === ActionTypes.FILTER) {
        if (!e.data.filtersBy?.dateRange) {
            return
        }
        const {
            filtersBy: { dateRange },
        } = e.data

        if (!dateRange?.start || !dateRange?.end) {
            return
        }

        let result = currentState.storage

        const { start, end } = dateRange

        if (currentState.filtersBy.searchBy) {
            const {
                filtersBy: { searchBy },
            } = currentState
            result = filterByName(result, searchBy)
        }

        result = filterByDateRange(result, start, end)
        result = sortByStartDate(result)
        const current = result?.slice(0, currentState.limit)
        const next = updateState(e.data, {
            state: result,
        })
        notify(onUpdateAction(next, current))
        return
    }
}

const updateState = (e: StorageDispatchEvent, state?: Partial<typeof initialState>) => {
    currentState = {
        ...currentState,
        storage: state?.storage || currentState.storage || [],
        state: state?.state || [],
        filtersBy: {
            ...currentState.filtersBy,
            ...(e.filtersBy || {}),
            ...(state?.filtersBy || {}),
        },
        count: state?.count || currentState.count || 0,
        total: state?.total || currentState.total || 0,
        currentPage: state?.currentPage || 1,
    }
    return currentState
}

const onInitAction = (data: Partial<typeof initialState>): StorageMessageEvent => {
    const result = sortByStartDate(data.storage || [])
    const current = result?.slice(0, currentState.limit)
    return {
        state: current,
        count: data.count,
        total: data.total,
        type: ActionTypes.INIT,
    }
}

const onPaginateAction = (state: Partial<typeof initialState>): StorageMessageEvent => {
    return {
        state: state.state,
        count: getTotalPages(currentState.state),
        total: currentState.total,
        type: ActionTypes.UPDATE,
        currentPage: state.currentPage,
        filtersBy: state.filtersBy,
    }
}

const onAddAction = (data: Partial<typeof initialState>, state: Item[]): StorageMessageEvent => {
    return {
        state: state,
        count: getTotalPages(data.state || []),
        total: data.total,
        type: ActionTypes.UPDATE,
        currentPage: 1,
        filtersBy: data.filtersBy,
    }
}

const onUpdateAction = (data: Partial<typeof initialState>, state: Item[]): StorageMessageEvent => {
    return {
        state: state,
        count: getTotalPages(data.state || []),
        total: data.total,
        type: ActionTypes.UPDATE,
        currentPage: 1,
        filtersBy: data.filtersBy,
    }
}

const onResetAction = (data: Partial<typeof initialState>): StorageMessageEvent => {
    return {
        type: ActionTypes.UPDATE,
        total: data.total,
        count: data.count,
        state: data.state,
        filtersBy: data.filtersBy,
        currentPage: 1,
    }
}

const isNotEmptyArray = (data?: Item[]): data is Item[] => {
    return Array.isArray(data) && data.length > 0
}

const isActionType = (action: string): action is ActionTypes => {
    return Object.values(ActionTypes).includes(action as ActionTypes)
}

const getTotalPages = (data: Item[]) => {
    return Math.ceil(data.length / currentState.limit)
}

const filterByDateRange = (data: Item[], start: string, end: string) => {
    try {
        const userStart = formatDateString(start, DATE_PARSE_SEPARATOR)
        const userEnd = formatDateString(end, DATE_PARSE_SEPARATOR)

        return data.filter(item => {
            const itemStartDate = formatDateString(item.startDate, DATE_PARSE_SEPARATOR)
            const itemEndDate = formatDateString(item.endDate, DATE_PARSE_SEPARATOR)

            return itemStartDate >= userStart && itemEndDate <= userEnd
        })
    } catch (e) {
        console.error(e)
        return []
    }
}

const filterByName = (data: Item[], searchBy: InputType) => {
    return data.filter(item =>
        item.name
            .toLowerCase()
            .trim()
            .includes((searchBy as string).toLowerCase().trim() || ''),
    )
}

const formatDateString = (str: string, separator = '/') => {
    const [month, day, year] = str.split(separator).map(part => part.padStart(2, '0'))
    return new Date(`${year}-${month}-${day}`)
}

const sortByStartDate = (data: Item[]): Item[] => {
    return data.sort((a, b) => {
        const dateA = formatDateString(a.startDate, DATE_PARSE_SEPARATOR)
        const dateB = formatDateString(b.startDate, DATE_PARSE_SEPARATOR)
        return dateA.valueOf() - dateB.valueOf()
    })
}

const notify = (data: StorageMessageEvent) => {
    postMessage(data)
}
