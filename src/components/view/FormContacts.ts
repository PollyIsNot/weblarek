import { Form, IFormData } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IFormContactsData extends IFormData {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, 'contacts:submit');

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('form:change', { field: 'email', value: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('form:change', { field: 'phone', value: this.phoneInput.value });
        });
    }

    set email(email: string) {
        this.emailInput.value = email;
    }

    set phone(phone: string) {
        this.phoneInput.value = phone;
    }
}
