import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class CatalogModel {
    private _items: IProduct[] = [];
    private _preview: IProduct | null = null;

    constructor(private events: IEvents) {}

    // установка массива товаров
    setProducts(items: IProduct[]): void {
        this._items = items;
        this.events.emit('items:changed');
    }

    // получение всех товаров
    getProducts(): IProduct[] {
        return this._items;
    }

    // получение товара по ID
    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    // установка товара для предпросмотра
    setPreview(product: IProduct): void {
        this._preview = product;
        this.events.emit('preview:changed');
    }

    // получение товара для предпросмотра
    getPreview(): IProduct | null {
        return this._preview;
    }
}



