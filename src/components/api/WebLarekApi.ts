import { IApi, IProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

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
 postOrder(order: IOrderRequest): Promise<IOrderResponse> {
  return this.api.post<IOrderResponse>('/order/', order);
 }
}
