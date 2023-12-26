export enum ResourceStatus {
    error = 'error',
    pending = 'pending',
    success = 'success',
}

export type ResourcePromise<T> = () => Promise<() => T>

export const resourceable = <T>(promise: ResourcePromise<T>) => {
    let status = ResourceStatus.pending
    let result: T

    const suspender = promise()
        .then(callback => callback())
        .then(
            response => {
                status = ResourceStatus.success
                result = response
            },
            e => {
                status = ResourceStatus.error
                result = e
            },
        )
    return {
        read() {
            if (status === ResourceStatus.pending) {
                throw suspender
            } else if (status === ResourceStatus.error) {
                throw result
            }
            return result
        },
        reset() {
            if (result && status === ResourceStatus.success) {
                result = null as unknown as T
            }
        },
    }
}
