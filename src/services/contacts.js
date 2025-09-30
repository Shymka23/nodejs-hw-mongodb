import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async (query = {}, userId) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const skip = (page - 1) * perPage;
  const limit = parseInt(perPage);

  // Створюємо фільтр з userId
  const filter = { userId };
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  // Створюємо об'єкт сортування
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [contacts, totalItems] = await Promise.all([
    ContactsCollection.find(filter).sort(sort).skip(skip).limit(limit),
    ContactsCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page: parseInt(page),
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async contactData => {
  const contact = await ContactsCollection.create(contactData);
  return contact;
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {}
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
