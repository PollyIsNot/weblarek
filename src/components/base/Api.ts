type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('Content-Type') || '';

        if (!response.ok) {
            const errorText = contentType.includes('application/json')
                ? await response.json().then(data => data.error ?? response.statusText)
                : response.statusText || `HTTP ${response.status}`;
            return Promise.reject(errorText);
        }

        if (contentType.includes('application/json')) {
            return response.json() as Promise<T>;
        }

        const text = await response.text();
        throw new Error(`Ожидался JSON, но сервер вернул ${contentType || 'не JSON'}: ${text.slice(0, 200)}`);
    }

    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}
