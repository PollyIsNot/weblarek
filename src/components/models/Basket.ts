import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Basket {
    private _items: IProduct[] = [];

    constructor(private events: IEvents) {}

    //добавить товар в корзину
    addItem(item: IProduct): void {
        if (!this._items.find(product => product.id === item.id)) {
            this._items.push(item);
            this.events.emit('basket:changed', { items: this._items });
        }
    }

    //удалить товар из корзины
    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed', { items: this._items });
    }

    //получение всех товаров в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    //получить количество товаров в корзине
    getCount(): number {
        return this._items.length;
    }

    //получение общей стоимости товаров в корзине
    getTotal(): number {
        return this._items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    //очистить корзину

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', { items: this._items });
    }

    //проверка, есть ли товар в корзине
    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}
