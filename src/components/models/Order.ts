import { IOrder } from '../../types/index';
import { IEvents } from '../base/Events';

export class Order {
    private _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };

    private _formErrors: Record<string, string> = {};

    constructor(private events: IEvents) {}


    //установить способ оплаты
    setPayment(payment: string): void {
        this._order.payment = payment;
        this.validateOrder();
    }


    //установить адрес доставки
    setAddress(address: string): void {
        this._order.address = address;
        this.validateOrder();
    }


    //установить email
    setEmail(email: string): void {
        this._order.email = email;
        this.validateOrder();
    }


    //установить телефон
    setPhone(phone: string): void {
        this._order.phone = phone;
        this.validateOrder();
    }


    //установить общую стоимость
    setTotal(total: number): void {
        this._order.total = total;
    }


    //Установить товары в заказе
    setItems(items: string[]): void {
        this._order.items = items;
    }


    //получить данные заказа
    getOrder(): IOrder {
        return this._order;
    }


    //получить ошибки валидации
    getFormErrors(): Record<string, string> {
        return this._formErrors;
    }


    //валидировать заказ
    private validateOrder(): void {
        this._formErrors = {};

        if (!this._order.payment) {
            this._formErrors.payment = 'Необходимо выбрать способ оплаты';
        }

        if (!this._order.address) {
            this._formErrors.address = 'Необходимо указать адрес доставки';
        }

        if (!this._order.email) {
            this._formErrors.email = 'Необходимо указать email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._order.email)) {
            this._formErrors.email = 'Некорректный email';
        }

        if (!this._order.phone) {
            this._formErrors.phone = 'Необходимо указать телефон';
        }

        this.events.emit('order:validated', { 
            isValid: Object.keys(this._formErrors).length === 0,
            errors: this._formErrors 
        });
    }


    //очистить заказ
    clear(): void {
        this._order = {
            payment: '',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        };
        this._formErrors = {};
    }
}
