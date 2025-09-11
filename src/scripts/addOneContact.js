import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

// Функція для додавання одного випадкового контакту
export const addOneContact = async () => {
  try {
    // Читаємо існуючі контакти
    const existingContacts = await readContacts();
    // Створюємо один новий контакт
    const newContact = createFakeContact();
    // Додаємо новий контакт до існуючих
    const updatedContacts = [...existingContacts, newContact];

    await writeContacts(updatedContacts);

    console.log('Successfully added one contact.');
  } catch (error) {
    console.error('Error adding contact:', error);
  }
};

// Додаємо один контакт при запуску скрипта
addOneContact();
