import { Form, IFormData } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment, FormErrors } from '../../types';

export interface IFormOrderData extends IFormData {
    payment?: TPayment;
    address?: string;
}

export class FormOrder extends Form {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);

        // Обработчик для кнопки "Онлайн"
        this.cardButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
            this.events.emit('form:change', { field: 'payment', value: 'card' });
        });

        // Обработчик для кнопки "При получении"
        this.cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
            this.events.emit('form:change', { field: 'payment', value: 'cash' });
        });

        // Обработчик для поля адреса
        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('form:change', { field: 'address', value: target.value });
        });
    }

    render(data: IFormOrderData): HTMLElement {
        this.setPayment(data.payment || null);
        this.setAddress(data.address || '');
        this.setErrors(data.errors);
        this.setSubmitButtonState(!data.isSubmitDisabled);
        return this.container;
    }

    setPayment(payment: TPayment | null): void {
        this.cardButton.classList.toggle('button_alt-active', payment === 'card');
        this.cashButton.classList.toggle('button_alt-active', payment === 'cash');
    }

    setAddress(address: string): void {
        this.addressInput.value = address;
    }
}














