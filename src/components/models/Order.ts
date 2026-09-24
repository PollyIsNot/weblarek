import { IBuyer, TPayment } from '../../types/index';
import { IEvents } from '../base/Events';

export class Order {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor(private events: IEvents) {}

    // установить способ оплаты
    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    // установить адрес доставки
    setAddress(address: string): void {
        this._address = address;
    }

    // установить email
    setEmail(email: string): void {
        this._email = email;
    }

    // установить телефон
    setPhone(phone: string): void {
        this._phone = phone;
    }

    // получить данные заказа
    getOrder(): IBuyer {
        return {
            payment: this._payment || 'card',
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    // валидировать заказ
    validate(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this._payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }

        if (!this._address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        if (!this._email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this._phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        return errors;
    }

    // очистить заказ
    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
    }
}


