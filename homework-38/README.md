# My React App

React проект створений за допомогою [Vite](https://vitejs.dev/), що демонструє створення та використання компонентів з props та обробниками подій.

## 📦 Технології

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- ESLint

## 🧩 Компоненти

### Button
Кнопка з підтримкою props:
- `text` — текст кнопки
- `type` — тип кнопки (`button`, `submit`)
- `onClick` — обробник кліку

```jsx
<Button text="Натисни мене" type="button" onClick={handleClick} />
```

### Input
Поле введення з підтримкою props:
- `placeholder` — підказка
- `type` — тип поля (`text`, `password`)
- `onChange` — обробник зміни значення

```jsx
<Input placeholder="Введіть текст..." type="text" onChange={handleChange} />
```

## 🚀 Встановлення та запуск

```bash
# Клонувати репозиторій
git clone https://github.com/YOUR_USERNAME/my-react-app.git

# Перейти до папки проекту
cd my-react-app

# Встановити залежності
npm install

# Запустити у режимі розробки
npm run dev
```

Після запуску відкрий [http://localhost:5173](http://localhost:5173) у браузері.

## 🏗️ Збірка для production

```bash
npm run build
```

Готові файли з'являться в папці `dist/`.

## 🌐 Демо

[Посилання на демо](https://YOUR_NETLIFY_LINK.netlify.app)

## 📁 Структура проекту

```
my-react-app/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```
