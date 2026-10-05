import { IBuyer, TPayment, FormErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class BuyerModel {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    constructor(private events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this._payment = data.payment;
        }
        if (data.email !== undefined) {
            this._email = data.email;
        }
        if (data.phone !== undefined) {
            this._phone = data.phone;
        }
        if (data.address !== undefined) {
            this._address = data.address;
        }

        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    validate(): FormErrors {
        const errors: FormErrors = {};

        if (!this._payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        if (!this._email.trim()) {
            errors.email = 'Необходимо указать email';
        }
        if (!this._phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }

        return errors;
    }

    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
        this.events.emit('buyer:changed');
    }
}
