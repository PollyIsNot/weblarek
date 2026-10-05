import { Form, IFormData } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

export interface IFormOrderData extends IFormData {
    payment: TPayment | null;
    address: string;
}

export class FormOrder extends Form<IFormOrderData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, 'order:submit');

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('form:change', { field: 'payment', value: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('form:change', { field: 'payment', value: 'cash' });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('form:change', { field: 'address', value: this.addressInput.value });
        });
    }

    set payment(payment: TPayment | null) {
        this.cardButton.classList.toggle('button_alt-active', payment === 'card');
        this.cashButton.classList.toggle('button_alt-active', payment === 'cash');
    }

    set address(address: string) {
        this.addressInput.value = address;
    }
}
