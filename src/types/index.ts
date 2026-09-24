export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

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

// interface для заказа
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
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
    total: number;
}

// interface для состояния заказа
export interface IOrderData {
    payment: string;
    email: string;
    phone: string;
    address: string;
}
