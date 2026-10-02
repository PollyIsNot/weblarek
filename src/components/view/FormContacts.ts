import { Form, IFormData } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IFormContactsData extends IFormData {
    email?: string;
    phone?: string;
}

export class FormContacts extends Form {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
    }

    render(data: IFormContactsData): HTMLElement {
        this.setEmail(data.email || '');
        this.setPhone(data.phone || '');
        this.setErrors(data.errors);
        this.setSubmitButtonState(!data.isSubmitDisabled);
        return this.container;
    }

    setEmail(email: string): void {
        this.emailInput.value = email;
    }

    setPhone(phone: string): void {
        this.phoneInput.value = phone;
    }
}







