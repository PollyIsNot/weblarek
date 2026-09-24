export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// interface для товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// interface для покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// interface для заказа
export interface IOrder extends IBuyer {
    items: string[];
}

// interface для ответа сервера при создании заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// interface для состояния корзины
export interface IBasketData {
    items: IProduct[];
}

// interface для состояния заказа
export interface IOrderData {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

// ответ сервера на GET product
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

// тело запроса POST order
export interface IOrderRequest extends IOrder {
    items: string[];
}

// ответ сервера на POST order
export interface IOrderResponse {
    id: string;
    total: number;
}

