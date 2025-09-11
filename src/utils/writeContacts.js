import { writeFile } from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

// Функція для запису контактів у JSON файл
export const writeContacts = async (updatedContacts) => {
  try {
    // Записуємо масив контактів у файл з форматуванням
    await writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2));
  } catch (error) {
    console.error('Error writing contacts:', error);
  }
};
