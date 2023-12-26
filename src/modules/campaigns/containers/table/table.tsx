import { Table } from 'flowbite-react'
import { memo, PropsWithChildren } from 'react'

export interface CampaignsListProps {
    headers: string[]
}

export const CampaignsListView = (props: PropsWithChildren<CampaignsListProps>) => {
    return (
        <div className="flex flex-col space-y-1.5">
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <div className="border rounded-xl overflow-hidden dark:border-gray-700">
                        <Table>
                            <Table.Head>
                                {props.headers.map((header, index) => {
                                    const key = `${header}-${index}`
                                    return <Table.HeadCell key={key}>{header}</Table.HeadCell>
                                })}
                            </Table.Head>
                            <Table.Body className="divide-y">{props.children}</Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const CampaignsList = memo(CampaignsListView)

export default CampaignsList
