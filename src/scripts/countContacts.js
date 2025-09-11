import { readContacts } from '../utils/readContacts.js';

// Функція для підрахунку кількості контактів
export const countContacts = async () => {
  try {
    // Читаємо контакти та повертаємо їх кількість
    const contacts = await readContacts();
    return contacts.length;
  } catch (error) {
    console.error('Error counting contacts:', error);
    return 0;
  }
};

// Виводимо кількість контактів при запуску скрипта
console.log(await countContacts());
