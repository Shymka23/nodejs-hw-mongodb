import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

// Функція для генерації заданої кількості випадкових контактів
const generateContacts = async (number) => {
  try {
    // Читаємо існуючі контакти
    const existingContacts = await readContacts();
    const newContacts = [];

    // Створюємо задану кількість нових контактів
    for (let i = 0; i < number; i++) {
      newContacts.push(createFakeContact());
    }

    // Об'єднуємо існуючі та нові контакти
    const updatedContacts = [...existingContacts, ...newContacts];
    await writeContacts(updatedContacts);

    console.log(`Successfully generated ${number} contacts.`);
  } catch (error) {
    console.error('Error generating contacts:', error);
  }
};

// Генеруємо 5 контактів при запуску скрипта
generateContacts(5);
