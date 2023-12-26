import { Table } from 'flowbite-react'
import { memo, PropsWithChildren, useMemo } from 'react'
import { formatter } from '../../../../utils/currency.ts'
import Status from '../../components/status.tsx'

export interface CampaignsListBodyProps {
    data?: Item[]
}

const CampaignsListBodyView = (props: PropsWithChildren<CampaignsListBodyProps>) => {
    const format = useMemo(() => formatter.format, [])
    if (!props.data?.length) {
        return null
    }
    return (
        <>
            {props.data.map((item, index) => {
                const key = `${item.id}-${item.name}-${item.budget}-${item.startDate}-${item.endDate}-${index}`
                return (
                    <Table.Row key={key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {item.name}
                        </Table.Cell>
                        <Table.Cell>
                            <Status active={item.active} />
                        </Table.Cell>
                        <Table.Cell>{item.startDate}</Table.Cell>
                        <Table.Cell>{item.endDate}</Table.Cell>
                        <Table.Cell>{format(item.budget)}</Table.Cell>
                    </Table.Row>
                )
            })}
        </>
    )
}

export const CampaignsListBody = memo(CampaignsListBodyView)

export default CampaignsListBody
