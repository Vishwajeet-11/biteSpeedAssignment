import { query } from "../databases/dbConnection.js";

export const findUserByEmailOrPhone = async ({ email, phoneNumber } = {}) => {
  if (!email && !phoneNumber) {
    throw new Error('At least one of email or phoneNumber must be provided');
  }

  let queryStr = 'SELECT * FROM contact WHERE';
  const queryParams = [];

  if (email) {
    queryStr += ' email = $1';
    queryParams.push(email);
  }

  if (phoneNumber) {
    if (queryParams.length > 0) {
      queryStr += ' OR ';
    }
    queryStr += ` phoneNumber = $${queryParams.length + 1}`;
    queryParams.push(phoneNumber);
  }

  try {
    const result = await query(queryStr, queryParams);
    console.log('Query result:', result);
    return result.length > 0 ? result : [];
  } catch (error) {
    console.error('Error in findUserByEmailOrPhone:', error);
    throw error;
  }
};

export const createUser = async ({ email, phoneNumber, linkedId = null, linkPrecedence }) => {
  try {
    const result = await query(
      "INSERT INTO contact (email, phoneNumber, linkedId, linkPrecedence) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, phoneNumber, linkedId, linkPrecedence]
    );
    console.log('Create user result:', result); // Add logging to check result
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};
