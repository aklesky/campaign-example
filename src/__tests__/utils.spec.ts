import { formatter } from '../utils/currency.js'

import seed from '../../mock/seed.json'

const formatDateString = (str: string, separator = '/') => {
    const [month, day, year] = str.split(separator).map(part => part.padStart(2, '0'))
    return new Date(`${year}-${month}-${day}`)
}

const filterByName = (data: Item[], searchBy: InputType) => {
    return data.filter(item =>
        item.name
            .toLowerCase()
            .trim()
            .includes((searchBy as string).toLowerCase().trim() || ''),
    )
}

const filterByDateRange = (data: Item[], start: string, end: string) => {
    try {
        const userStart = formatDateString(start)
        const userEnd = formatDateString(end)

        return data.filter(item => {
            const itemStartDate = formatDateString(item.startDate)
            const itemEndDate = formatDateString(item.endDate)

            return itemStartDate >= userStart && itemEndDate <= userEnd
        })
    } catch (e) {
        console.error(e)
        return []
    }
}

const sortByStartDate = (data: Item[]): Item[] => {
    return data.sort((a, b) => {
        const dateA = formatDateString(a.startDate)
        const dateB = formatDateString(b.startDate)
        return dateA.valueOf() - dateB.valueOf()
    })
}

describe('Utilities Suite', () => {
    it('should format number to the us currency', () => {
        expect(formatter.format(1000)).toBe('$1,000.00')
    })

    it('should add leading zeros and format string to the date', () => {
        const got = formatDateString('1/1/2020')
        const want = new Date('2020-01-01T00:00:00.000Z')
        expect(got).toEqual(want)
    })

    it('should find objects by name in the json array', () => {
        const got = filterByName(seed, 'HapPy')
        expect(got.length).toBeGreaterThan(0)
        expect(got).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Happy Journey 21' })]))
    })

    it('should sort objects by start date in the json array', () => {
        const got = sortByStartDate(seed)
        expect(got.length).toBeGreaterThan(0)
        expect(got[0]).toEqual(expect.objectContaining({ startDate: '01/01/2023' }))
    })

    it('should find objects by date range in the json array', () => {
        const got = filterByDateRange(seed, '3/1/2020', '4/30/2023')
        expect(got.length).toBeGreaterThan(0)
        expect(got).toEqual(
            expect.arrayContaining([expect.objectContaining({ name: 'Happy Journey 21', active: false })]),
        )
    })
})
