import { readContacts } from '../utils/readContacts.js';

// Функція для отримання всіх контактів
export const getAllContacts = async () => {
  try {
    // Читаємо та повертаємо всі контакти
    const contacts = await readContacts();
    return contacts;
  } catch (error) {
    console.error('Error getting all contacts:', error);
    return [];
  }
};

// Виводимо всі контакти при запуску скрипта
console.log(await getAllContacts());
