import { readFile } from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

// Функція для читання контактів з JSON файлу
export const readContacts = async () => {
  try {
    // Читаємо файл та парсимо JSON
    const data = await readFile(PATH_DB, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // При помилці повертаємо порожній масив
    console.error('Error reading contacts:', error);
    return [];
  }
};
