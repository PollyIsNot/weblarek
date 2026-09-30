import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Products {
    private _items: IProduct[] = [];
    private _preview: string | null = null;

    constructor(private events: IEvents) {}

    // установка массива товаров
    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('items:changed', { items: this._items });
    }

    // получение всех товаров
    getItems(): IProduct[] {
        return this._items;
    }

    // получение товара по ID
    getProduct(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    // установка ID товара для предпросмотра
    setPreview(id: string): void {
        this._preview = id;
        this.events.emit('preview:changed', { preview: this.getProduct(id) });
    }

    // получение ID товара для предпросмотра
    getPreview(): string | null {
        return this._preview;
    }
}


