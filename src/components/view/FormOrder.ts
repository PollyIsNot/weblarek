import { Form } from './Form';

export class FormOrder extends Form {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: any) {
        super(container, events);

        this.cardButton = this.form.querySelector('button[name="card"]') as HTMLButtonElement;
        this.cashButton = this.form.querySelector('button[name="cash"]') as HTMLButtonElement;
        this.addressInput = this.form.querySelector('input[name="address"]') as HTMLInputElement;

        // проверка на null
        if (!this.cardButton || !this.cashButton || !this.addressInput) {
            throw new Error('Не найдены необходимые элементы в форме заказа');
        }

        this.cardButton.addEventListener('click', () => this.selectPayment('card'));
        this.cashButton.addEventListener('click', () => this.selectPayment('cash'));
    }

    selectPayment(method: 'card' | 'cash'): void {
        this.cardButton.classList.toggle('button_alt-active', method === 'card');
        this.cashButton.classList.toggle('button_alt-active', method === 'cash');
        this.events.emit('form:change', { field: 'payment', value: method });
    }

    render(): HTMLElement {
        this.clearForm();
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');
        return this.container;
    }
}


