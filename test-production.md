# 🧪 Тестування CRUD API на продакшн

## URL вашого деплою (замініть на ваш):

`https://your-app-name.onrender.com`

## 📋 Тести CRUD операцій:

### 1️⃣ GET /contacts (отримання всіх контактів)

```bash
curl https://your-app-name.onrender.com/contacts
```

### 2️⃣ POST /contacts (створення контакту)

```bash
curl -X POST https://your-app-name.onrender.com/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Contact",
    "phoneNumber": "+380987654321",
    "email": "test@example.com",
    "contactType": "work",
    "isFavourite": false
  }'
```

**Очікується:** статус 201, створений контакт з \_id

### 3️⃣ GET /contacts/:id (отримання за ID)

```bash
# Скопіюйте _id з попередньої відповіді
curl https://your-app-name.onrender.com/contacts/COPIED_ID
```

**Очікується:** статус 200, конкретний контакт

### 4️⃣ PATCH /contacts/:id (оновлення)

```bash
curl -X PATCH https://your-app-name.onrender.com/contacts/COPIED_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Contact",
    "isFavourite": true
  }'
```

**Очікується:** статус 200, оновлений контакт

### 5️⃣ DELETE /contacts/:id (видалення)

```bash
curl -X DELETE https://your-app-name.onrender.com/contacts/COPIED_ID
```

**Очікується:** статус 204, порожня відповідь

### 6️⃣ Тести помилок

```bash
# 404 - неіснуючий контакт
curl https://your-app-name.onrender.com/contacts/507f1f77bcf86cd799439011

# 404 - неіснуючий роут
curl https://your-app-name.onrender.com/wrongroute
```

## 🎯 Очікувані відповіді:

- **GET /contacts**: `{"status":200,"message":"Successfully found contacts!","data":[...]}`
- **POST /contacts**: `{"status":201,"message":"Successfully created a contact!","data":{...}}`
- **PATCH /contacts/:id**: `{"status":200,"message":"Successfully patched a contact!","data":{...}}`
- **DELETE /contacts/:id**: статус 204, порожня відповідь
- **404 помилки**: `{"message":"Contact not found"}` або `{"message":"Route not found"}`
