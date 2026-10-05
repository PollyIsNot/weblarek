https://github.com/PollyIsNot/weblarek

# Проектная работа "Веб-ларек"
Полнофункциональное веб-приложение интернет-магазина с товарами для веб-разработчиков. Пользователи могут просматривать каталог товаров, добавлять их в корзину, оформлять заказы с выбором способа оплаты и получать подтверждение заказа.

Установка и запуск

`npm install`
`npm run dev`

Сборка

`npm run build`

Структура проекта

```typescript
src/
├── components/
│   ├── api/              # API клиент
│   ├── base/             # Базовые классы
│   ├── common/           # Общие компоненты
│   ├── models/           # Модели данных
│   └── view/             # Компоненты представления
├── types/                # TypeScript типы
├── utils/                # Утилиты и константы
├── scss/                 # Стили
└── main.ts               # Точка входа
```



# API

## WebLarekApi

Класс для работы с API сервера.

`getProducts(): Promise<IProductsResponse>`
// Получить массив товаров с сервера

`postOrder(order: IOrder): Promise<IOrderResult>`
// Отправить заказ на сервер


## Api

Базовый класс для HTTP запросов.

`get<T>(uri: string): Promise<T>`
// GET запрос

`post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>`
// POST/PUT/DELETE запрос

`handleResponse<T>(response: Response): Promise<T>`
// Обработка ответа сервера




# Модели данных

## CatalogModel

Управление товарами в каталоге.

`setProducts(items: IProduct[]): void`
// Установить товары и генерировать событие items:changed

`getProducts(): IProduct[]`
// Получить все товары

`getProductById(id: string): IProduct | undefined`
// Получить товар по ID

`setPreview(product: IProduct): void`
// Установить товар для предпросмотра

`getPreview(): IProduct | null`
// Получить товар для предпросмотра


События:
• `items:changed` — товары изменились
• `preview:changed` — товар для просмотра изменился



## Basket

Управление товарами в корзине.

`getItems(): IProduct[]`
// Получить все товары в корзине

`addItem(product: IProduct): void`
// Добавить товар в корзину

`removeItem(productId: string): void`
// Удалить товар из корзины

`hasItem(productId: string): boolean`
// Проверить наличие товара в корзине

`getTotal(): number`
// Получить общую стоимость

`getCount(): number`
// Получить количество товаров

`clear(): void`
// Очистить корзину


События:
• `basket:changed` — содержимое корзины изменилось



## BuyerModel

Управление данными покупателя и валидация.

`setData(data: Partial<IBuyer>): void`
// Сохранить данные покупателя и генерировать событие buyer:changed

`getData(): IBuyer`
// Получить данные покупателя

`validate(): FormErrors`
// Получить ошибки валидации

`clear(): void`
// Очистить данные покупателя


События:
• `buyer:changed` — данные покупателя изменились



# Компоненты представления

## Component (базовый класс)

`render(data?: Partial<T>): HTMLElement`
// Отобразить компонент с данными

`setImage(element: HTMLImageElement, src: string, alt?: string): void`
// Установить изображение с альтернативным текстом



## Modal

Модальное окно.

`setContent(content: HTMLElement): void`
// Установить содержимое модального окна

`open(): void`
// Открыть модальное окно

`close(): void`
// Закрыть модальное окно



## Header

Шапка сайта.

`setCounter(count: number): void`
// Установить счетчик товаров в корзине



## Gallery

Сетка товаров.

`render(data: { items: HTMLElement[] }): HTMLElement`
// Отобразить товары в галерее



## CardBase

Общий родитель для карточек товара.

`setTitle(title: string): void`
// Установить название товара

`setPrice(price: number | null): void`
// Установить цену товара



## Card

Карточка товара в каталоге.

`render(data: IProduct): HTMLElement`
// Отобразить карточку товара



## CardPreview

Подробный просмотр товара.

`render(data: ICardPreviewData): HTMLElement`
// Отобразить товар с описанием и состоянием кнопки

`setButtonText(text: string): void`
// Установить текст кнопки

`setButtonDisabled(disabled: boolean): void`
// Установить состояние кнопки



## CardBasket

Товар в корзине.

`render(data: ICardBasketData): HTMLElement`
// Отобразить товар в корзине с индексом

`index: number`
// Установить порядковый номер товара

 

## BasketView

Представление корзины.

`render(data?: IBasketViewData): HTMLElement`
// Отобразить корзину с товарами и суммой или вернуть готовую разметку

`setDisabled(disabled: boolean): void`
// Отключить кнопку оформления при пустой корзине

 

## Form (базовый класс для форм)

`errors: FormErrors`
// Отобразить ошибки валидации

`isSubmitDisabled: boolean`
// Установить состояние кнопки отправки

Данные формы передаются через родительский метод render().



## FormOrder

Форма выбора способа оплаты и адреса.

`payment: TPayment | null`
// Установить активный способ оплаты

`address: string`
// Установить адрес доставки



## FormContacts

Форма ввода контактных данных.

`email: string`
// Установить email

`phone: string`
// Установить телефон



## Success

Экран успешного оформления заказа.

`render(data: { total: number }): HTMLElement`
// Отобразить сумму списанных синапсов



## Типы данных
```typescript
// Товар
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```
```typescript
// Покупатель
interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}
```
```typescript
// Способ оплаты
type TPayment = 'card' | 'cash';
```
```typescript
// Ошибки валидации
type FormErrors = Partial<Record<keyof IBuyer, string>>;
```
```typescript
// Заказ
interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

// Ответ сервера при получении товаров
interface IProductsResponse {
    total: number;
    items: IProduct[];
}

// Ответ сервера при отправке заказа
interface IOrderResult {
    id: string;
    total: number;
}
```


# Архитектура

Приложение построено по паттерну MVP.

Model
// Хранит данные каталога, корзины и покупателя

View
// Отображает данные и сообщает о действиях пользователя

Presenter
// Реализован в main.ts, обрабатывает события и связывает модели с представлением

Модели генерируют события при изменении данных. Представления генерируют события при действиях пользователя. Презентер обрабатывает события, получает данные из моделей и передает их в компоненты представления.



# События приложения

```typescript
// Каталог
'items:changed'        // Товары изменились
'preview:changed'      // Товар для просмотра изменился
'card:select'          // Клик на карточку товара

// Корзина
'basket:changed'       // Содержимое корзины изменилось
'basket:open'          // Открытие корзины
'card:toggle'          // Добавить/удалить товар в корзину
'card:remove'          // Удалить товар из корзины

// Покупатель и заказ
'buyer:changed'        // Данные покупателя изменились
'order:open'           // Открытие формы заказа
'order:submit'         // Отправка первой формы (способ оплаты)
'contacts:submit'      // Отправка второй формы (контакты)

// Форма
'form:change'          // Изменение поля формы

// Успех
'success:close'        // Закрытие экрана успеха
```



# Константы

API_URL
// Базовый адрес API: ${VITE_API_ORIGIN}/api/weblarek

CDN_URL
// Адрес для изображений: ${VITE_API_ORIGIN}/content/weblarek

categoryMap
// Соответствие категорий CSS-модификаторам:
// 'софт-скил' → `'card__category_soft'`
// 'хард-скил' → `'card__category_hard'`
// 'кнопка' → `'card__category_button'`
// 'дополнительное' → `'card__category_additional'`
// 'другое' → `'card__category_other'`



# Утилиты
`ensureElement<T>(selector: string, context?: HTMLElement): T`
// Получить элемент по селектору

`ensureAllElements<T>(selector: string, context?: HTMLElement): T[]`
// Получить все элементы по селектору

`cloneTemplate<T>(query: string): T`
// Клонировать содержимое шаблона

`bem(block: string, element?: string, modifier?: string): object`
// Сгенерировать BEM селектор

`createElement<T>(tagName: string, props?: object, children?: HTMLElement[]): T`
// Создать HTML элемент

`setElementData<T>(el: HTMLElement, data: T): void`
// Установить data-атрибуты

`getElementData<T>(el: HTMLElement, scheme: object): T`
// Получить данные из data-атрибутов