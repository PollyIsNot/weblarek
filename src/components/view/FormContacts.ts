import { Form } from './Form';

export class FormContacts extends Form {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: any) {
        super(container, events);

        this.emailInput = this.form.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.form.querySelector('input[name="phone"]') as HTMLInputElement;

        // проверка на null
        if (!this.emailInput || !this.phoneInput) {
            throw new Error('Не найдены поля email или phone в форме контактов');
        }
    }

    render(): HTMLElement {
        this.clearForm();
        return this.container;
    }
}



