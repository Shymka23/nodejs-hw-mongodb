import { writeContacts } from '../utils/writeContacts.js';

// Функція для видалення всіх контактів
export const removeAllContacts = async () => {
  try {
    // Записуємо порожній масив, що видаляє всі контакти
    await writeContacts([]);
    console.log('Successfully removed all contacts.');
  } catch (error) {
    console.error('Error removing all contacts:', error);
  }
};

// Видаляємо всі контакти при запуску скрипта
removeAllContacts();
