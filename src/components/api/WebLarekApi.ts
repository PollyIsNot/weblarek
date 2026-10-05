import { IApi, IProductsResponse, IOrder, IOrderResult } from '../../types';

export class WebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // GET product получить объект с массивом товаров
    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    // POST order отправить заказ, получить подтверждение
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}
