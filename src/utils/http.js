import request from './request'

const method = (httpMethod) => (url, data, onSuccess, onFault, headers) => {
    return request({
        url: url,
        method: httpMethod,
        [httpMethod === 'post' ? 'data' : 'params']: data,
        headers,
    })
        .then((response) => {
            console.log('http-success');
            // handle success
            onSuccess ? onSuccess(response) : ''
            return response
        })
        .catch((error) => {
            console.log('http', error);
            // handle error
            if (onFault) {
                onFault(error)
            } else {
                //这里我认为要不用下面的写法，要不可以不return，直接 throw new Error(error.message || 'Error')
                // return Promise.reject(new Error(error.message || 'Error'))
                return Promise.reject(error)
            }
        })
}

export const get = method('get')
export const post = method('post')
export const put = method('put')
export const del = method('delete')
