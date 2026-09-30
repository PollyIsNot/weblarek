import { Component } from '../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data: { items: HTMLElement[] }): HTMLElement {
        this.container.innerHTML = '';
        data.items.forEach(item => {
            this.container.appendChild(item);
        });
        return this.container;
    }
}
