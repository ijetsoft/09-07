# Проект

Приложение Express + MongoDB (Pug) — готово к деплою на Vercel.

**Переменная окружения**
- Приложение ожидает переменную `MONGODB_URI` с корректной строкой подключения к MongoDB.

**Поддерживаемые форматы**
- MongoDB Atlas (SRV, рекомендовано):
  `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
- Стандартная (non-SRV):
  `mongodb://<username>:<password>@host1:27017,host2:27017/<dbname>?replicaSet=rs0&authSource=admin&retryWrites=true&w=majority`
- Локальная (разработка):
  `mongodb://localhost:27017/<dbname>`

Замените `<username>`, `<password>`, `<cluster>`, `<dbname>` на ваши значения.
Если пароль содержит спецсимволы, заранее URL-encode (например `pa$$word` → `pa%24%24word`).

**Локальная настройка (.env)**
1. Создайте в корне файл `.env` (файл не должен коммититься).
2. Пример содержания:

```
MONGODB_URI=mongodb+srv://appuser:pa%24%24word@cluster0.abcd.mongodb.net/mydb?retryWrites=true&w=majority
PORT=3000
```

**Vercel (пример)**
1. Откройте панель Vercel и выберите ваш проект.
2. Перейдите в Settings → Environment Variables.
3. Добавьте новую переменную:
   - Key: `MONGODB_URI`
   - Value: (ваша строка подключения)
   - Environment: `Production` (и/или `Preview`, `Development` по необходимости)
4. Сохраните и задеплойте проект заново.

**Запуск и проверка**
- Локально установите зависимости и запустите:

```bash
npm install
npm start
```

- Проверка состояния сервера и подключения к БД:

```bash
curl http://localhost:3000/health
```

Ожидаемый ответ пример:

```json
{"ok":true,"status":"healthy","mongo":true}
```

Если переменная `MONGODB_URI` не задана, приложение выдаст понятную ошибку при старте.

Если хотите — могу автоматически добавить пример `.env.example` или инструкцию по безопасному хранению секретов в CI/CD.