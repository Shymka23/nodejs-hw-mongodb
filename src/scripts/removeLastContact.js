import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

// Функція для видалення останнього контакту
export const removeLastContact = async () => {
  try {
    // Читаємо всі контакти
    const contacts = await readContacts();

    // Перевіряємо, чи є контакти для видалення
    if (contacts.length > 0) {
      // Видаляємо останній контакт за допомогою slice
      const updatedContacts = contacts.slice(0, -1);
      await writeContacts(updatedContacts);
      console.log('Successfully removed the last contact.');
    } else {
      console.log('No contacts to remove.');
    }
  } catch (error) {
    console.error('Error removing last contact:', error);
  }
};

// Видаляємо останній контакт при запуску скрипта
removeLastContact();
