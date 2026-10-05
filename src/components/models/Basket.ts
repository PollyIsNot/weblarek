import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Basket {
    private _items: IProduct[] = [];

    constructor(private events: IEvents) {}

    // получение всех товаров в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    // добавить товар в корзину
    addItem(product: IProduct): void {
        if (!this._items.find(item => item.id === product.id)) {
            this._items.push(product);
            this.events.emit('basket:changed');
        }
    }

    // удалить товар из корзины
    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
        this.events.emit('basket:changed');
    }

    // проверить наличие товара в корзине
    hasItem(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }

    // получить общую стоимость
    getTotal(): number {
        return this._items.reduce((sum, item) => {
            return sum + (item.price ? item.price : 0);
        }, 0);
    }

    // получить количество товаров
    getCount(): number {
        return this._items.length;
    }

    // очистить корзину
    clear(): void {
        this._items = [];
        this.events.emit('basket:changed');
    }
}
