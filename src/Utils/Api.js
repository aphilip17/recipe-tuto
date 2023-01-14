export class ApiErrors {
    constructor(errors) {
        this.errors = errors;
    }

    get errorsPerField() {
        return this.errors.reduce((acc, error) => {
            return {...acc, [error.field]: error.message};
        }, {})
    }
}

export async function apiFetch(endPoint, options = {}) {
    options = {
        credentials: 'include',
        headers: {
            Accept: 'application/json'
        },
        ...options
    };

    if (options.body !== null && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        options.body = JSON.stringify(options.body);
        options.headers['Content-type'] = 'application/json';
    }

    const response = await fetch('http://localhost:3333/' + endPoint, options);

    if (response.status === 204) {
        return null;
    }

    if (response.ok) {
        const responseData = await response.json();

        return responseData;
    } else {
        const responseErrorData = await response.json();
        throw new ApiErrors(responseErrorData.errors)
    }



    /* I have some issues with the server. Return response is not formatted well */
}