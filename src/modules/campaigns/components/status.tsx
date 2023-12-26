import { Badge } from 'flowbite-react'
import { memo, useMemo } from 'react'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { labels } from '../../../i18n.ts'

const StatusView = (props: { active: boolean }) => {
    const status = useMemo(() => {
        if (props.active) {
            return {
                color: 'green',
                icon: HiCheckCircle,
                label: labels.active,
            }
        }
        return {
            color: 'teal',
            icon: HiXCircle,
            label: labels.inactive,
        }
    }, [props.active])

    return (
        <Badge color={status.color} icon={status.icon} size="sm">
            {status.label}
        </Badge>
    )
}

export const Status = memo(StatusView)

export default Status
