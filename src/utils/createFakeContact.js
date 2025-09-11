import { faker } from '@faker-js/faker';

// Функція для створення випадкового контакту з фейковими даними
export const createFakeContact = () => ({
  id: faker.string.uuid(), // Унікальний ідентифікатор
  name: faker.person.fullName(), // Повне ім'я
  phone: faker.phone.number(), // Телефонний номер
  email: faker.internet.email(), // Електронна пошта
  job: faker.person.jobTitle(), // Назва професії
});
