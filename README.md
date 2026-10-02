https://github.com/PollyIsNot/weblarek

# Проектная работа "Веб-ларек"
Интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

# Стек технологий

• HTML5 — разметка
• SCSS — стилизация
• TypeScript — язык программирования
• Vite — сборщик проекта

# Установка и запуск

## Требования

• Node.js (версия 16 или выше)
• npm или yarn

## Установка зависимостей

`npm install`

или

`yarn install`


## Запуск в режиме разработки

`npm run dev`


или

`yarn dev`


Приложение будет доступно по адресу http://localhost:5173

## Сборка 

`npm run build`

или

`yarn build`


## Структура проекта

src/
├── components/          # React-подобные компоненты
│   ├── api/            # API клиент
│   ├── base/           # Базовые классы
│   ├── common/         # Общие компоненты (модальное окно)
│   ├── models/         # Модели данных (бизнес-логика)
│   └── view/           # Компоненты представления (UI)
├── images/             # Изображения
├── scss/               # Стили
├── types/              # TypeScript типы
├── utils/              # Утилиты и константы
├── main.ts             # Точка входа приложения
└── index.html          # HTML-файл главной страницы


## Архитектура приложения

Приложение построено на основе паттерна MVP (Model-View-Presenter), обеспечивающего четкое разделение ответственности:

• Model — слой данных, отвечает за хранение и изменение данных
• View — слой представления, отвечает за отображение данных на странице
• Presenter — логика приложения, связывает Model и View через события

Взаимодействие между компонентами осуществляется через событийно-ориентированный подход с использованием класса EventEmitter.

## Основной поток данных

1. Пользователь взаимодействует с представлением (View)
2. Представление генерирует событие
3. Презентер обрабатывает событие и вызывает методы модели
4. Модель изменяет данные и генерирует событие об изменении
5. Презентер обрабатывает событие изменения и обновляет представление

# Базовый код

## Класс Component

Базовый класс для всех компонентов интерфейса. Является дженериком и принимает тип данных, которые могут быть переданы в метод render.

Конструктор:

constructor(container: HTMLElement)


Методы:
• render(data?: Partial<T>): HTMLElement — отображает компонент с переданными данными
• setImage(element: HTMLImageElement, src: string, alt?: string): void — утилита для установки изображений

## Класс Api

Содержит базовую логику отправки HTTP-запросов.

Конструктор:

`constructor(baseUrl: string, options: RequestInit = {})`


Методы:
• get<T>(uri: string): Promise<T> — выполняет GET запрос
• post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> — выполняет POST/PUT/DELETE запрос
• handleResponse<T>(response: Response): Promise<T> — обработка ответа сервера

## Класс EventEmitter

Брокер событий, реализующий паттерн "Наблюдатель". Позволяет отправлять события и подписываться на события, происходящие в системе.

Методы:
• on<T>(event: EventName, callback: (data: T) => void): void — подписка на событие
• off(event: EventName, callback: Subscriber): void — отписка от события
• emit<T>(event: string, data?: T): void — инициализация события
• trigger<T>(event: string, context?: Partial<T>): (data: T) => void — создание функции-триггера события
• onAll(callback: (event: EmitterEvent) => void): void — подписка на все события
• offAll(): void — отписка от всех событий

# Модели данных

## Класс CatalogModel

Отвечает за управление товарами в каталоге.

Методы:
• `setProducts(items: IProduct[]): void` — сохраняет товары и генерирует событие items:changed
• `getProducts(): IProduct[]` — возвращает все товары
• `getProductById(id: string): IProduct | undefined` — получает товар по ID
• `setPreview(product: IProduct): void` — устанавливает товар для предпросмотра
• `getPreview(): IProduct | null` — получает товар для предпросмотра

События:
• `items:changed` — товары в каталоге изменились
• `preview:changed` — товар для предпросмотра изменился

## Класс Basket

Отвечает за управление товарами в корзине.

Методы:
• `getItems(): IProduct[]` — возвращает товары в корзине
• `addItem(product: IProduct): void` — добавляет товар в корзину
• `removeItem(productId: string): void` — удаляет товар из корзины
• `hasItem(productId: string): boolean` — проверяет наличие товара
• `getTotal(): number` — возвращает общую стоимость
• `getCount(): number` — возвращает количество товаров
• `clear(): void` — очищает корзину

События:
• `basket:changed` — содержимое корзины изменилось

## Класс Order

Отвечает за управление данными заказа и валидацию форм.

Методы:
• `setPayment(payment: TPayment): void` — устанавливает способ оплаты
• `setAddress(address: string): void` — устанавливает адрес доставки
• `setEmail(email: string): void` — устанавливает email
• `setPhone(phone: string): void` — устанавливает телефон
• `setTotal(total: number): void` — устанавливает итоговую сумму
• `setItems(items: string[]): void` — устанавливает товары в заказе
• `getOrder(): IBuyer & { total: number; items: string[] }` — возвращает полный объект заказа
• `getFormErrors(): FormErrors` — возвращает ошибки валидации
• `clear(): void` — сбрасывает данные заказа

События:
• `order:validated` — данные заказа валидированы

Валидация:
• Первая форма (способ оплаты и адрес): оба поля обязательны
• Вторая форма (контакты): email и телефон должны быть корректными

# API

## Класс WebLarekApi

Обмен данными с сервером.

Методы:
• `getProducts(): Promise<IProductsResponse>` — получает список товаров
• `postOrder(order: IOrderRequest): Promise<IOrderResponse>` — отправляет заказ на сервер

## Компоненты представления

### Gallery

Отображает сетку товаров в каталоге.

### Card

Карточка товара в каталоге с названием, изображением, категорией и ценой.

### CardPreview

Подробный просмотр товара с описанием и кнопкой добавления в корзину.

### CardBasket

Товар в корзине с индексом и кнопкой удаления.

### BasketView

Отображение содержимого корзины с общей стоимостью.

### Modal

Модальное окно для отображения товаров, корзины и форм.

### Header

Шапка сайта с логотипом и счетчиком товаров в корзине.

### FormOrder

Форма выбора способа оплаты и адреса доставки.

### FormContacts

Форма ввода email и телефона.

### Success

Экран успешного оформления заказа.

### Типы данных

// Товар
```typescript
interface IBuyer {
  payment: TPayment;  // Способ оплаты ('card'|'cash')
  email: string;      // Email адрес покупателя
  phone: string;      // Номер телефона покупателя
  address: string;    // Адрес доставки
}
```


// Покупатель
```typescript
interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}
```

// Способ оплаты
```typescript
type TPayment = 'card' | 'cash';
```

// Ошибки валидации
`type FormErrors = Partial<Record<keyof IBuyer, string>>;`

// Заказ
```typescript
interface IOrder extends IBuyer {
  items: string[];
  total: number;
}
```
```typescript
Основные события приложенияСобытие: `items:changed`
Генератор: CatalogModel
Обработчик: Presenter
Описание: Товары в каталоге изменились

Событие: `preview:changed`
Генератор: CatalogModel
Обработчик: Presenter
Описание: Товар для предпросмотра изменился

Событие: `basket:changed`
Генератор: Basket
Обработчик: Presenter
Описание: Содержимое корзины изменилось

Событие: `card:select`
Генератор: Card
Обработчик: Presenter
Описание: Клик на карточку товара

Событие: `card:add`
Генератор: CardPreview
Обработчик: Presenter
Описание: Добавление товара в корзину

Событие: `card:remove`
Генератор: CardBasket
Обработчик: Presenter
Описание: Удаление товара из корзины

Событие: `basket:open`
Генератор: Header, BasketView
Обработчик: Presenter
Описание: Открытие корзины

Событие: `order:open`
Генератор: BasketView
Обработчик: Presenter
Описание: Открытие формы заказа

Событие: `order:submit`
Генератор: FormOrder
Обработчик: Presenter
Описание: Отправка первой формы заказа

Событие: `order:validated`
Генератор: Order
Обработчик: Presenter
Описание: Валидация данных заказа

Событие: `form:change`
Генератор: Form, FormOrder, FormContacts
Обработчик: Presenter
Описание: Изменение поля формы

Событие: `form:submit`
Генератор: Form
Обработчик: Presenter
Описание: Отправка формы

Событие: `success:close`
Генератор: Success
Обработчик: Presenter
Описание: Закрытие экрана успеха
```

# Константы

 API_URL

Базовый адрес API сервера. Формируется из переменной окружения VITE_API_ORIGIN.

 CDN_URL

Базовый адрес для получения изображений товаров. Формируется из переменной окружения VITE_API_ORIGIN.

 categoryMap

Соответствие категорий товаров CSS-модификаторам для стилизации:
• 'софт-скил' → 'card__category_soft'
• 'хард-скил' → 'card__category_hard'
• 'кнопка' → 'card__category_button'
• 'дополнительное' → 'card__category_additional'
• 'другое' → 'card__category_other'

### Утилиты

 ensureElement

Получает элемент из DOM по селектору или возвращает переданный элемент.

### ensureAllElements

Получает все элементы из DOM по селектору.

### cloneTemplate

Клонирует содержимое HTML-шаблона.

### bem

Генерирует BEM-селектор и имя класса.

### createElement

Создает HTML-элемент с заданными свойствами и дочерними элементами.

### setElementData

Устанавливает data-атрибуты элемента.

### getElementData

Получает типизированные данные из data-атрибутов элемента.

# Поток оформления заказа

1. Пользователь нажимает кнопку "Оформить" в корзине
2. Открывается форма выбора способа оплаты и адреса доставки
3. После заполнения и нажатия "Далее" открывается форма ввода контактных данных
4. После заполнения и нажатия "Оплатить" заказ отправляется на сервер
5. При успешной отправке отображается экран успеха с информацией о заказе
6. После закрытия экрана успеха корзина и форма очищаются
