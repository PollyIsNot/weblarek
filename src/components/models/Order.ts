import { IBuyer, TPayment, FormErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class Order {
    private _payment: TPayment | null = null;
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';
    private _total: number = 0;
    private _items: string[] = [];
    private _formErrors: FormErrors = {};

    constructor(private events: IEvents) {}

    // Установить способ оплаты
    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.validateOrder();
    }

    // Установить адрес доставки
    setAddress(address: string): void {
        this._address = address;
        this.validateOrder();
    }

    // Установить email
    setEmail(email: string): void {
        this._email = email;
        this.validateContacts();
    }

    // Установить телефон
    setPhone(phone: string): void {
        this._phone = phone;
        this.validateContacts();
    }

    // Установить общую стоимость
    setTotal(total: number): void {
        this._total = total;
    }

    // Установить товары в заказе
    setItems(items: string[]): void {
        this._items = items;
    }

    // Получить данные заказа
    getOrder(): IBuyer & { total: number; items: string[] } {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address,
            total: this._total,
            items: this._items
        };
    }

    // Получить ошибки валидации
    getFormErrors(): FormErrors {
        return this._formErrors;
    }

    // Валидация первой формы (Способ оплаты и адрес)
    private validateOrder(): void {
        this._formErrors = {};

        if (!this._payment) {
            this._formErrors.payment = 'Необходимо выбрать способ оплаты';
        }

        if (!this._address) {
            this._formErrors.address = 'Необходимо указать адрес доставки';
        }

        this.events.emit('order:validated', {
            isValid: Object.keys(this._formErrors).length === 0,
            errors: this._formErrors
        });
    }

    // Валидация второй формы (Email и телефон)
    private validateContacts(): void {
        this._formErrors = {};

        if (!this._email || !this.isValidEmail(this._email)) {
            this._formErrors.email = 'Необходимо указать корректный email';
        }

        if (!this._phone || !this.isValidPhone(this._phone)) {
            this._formErrors.phone = 'Необходимо указать корректный телефон';
        }

        this.events.emit('order:validated', {
            isValid: Object.keys(this._formErrors).length === 0,
            errors: this._formErrors
        });
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Очистить данные заказа
    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
        this._total = 0;
        this._items = [];
        this._formErrors = {};
    }
}