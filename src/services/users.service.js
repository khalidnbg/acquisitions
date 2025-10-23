import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (error) {
    logger.error('Error fetching all users:', error);
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id));

    if (result.length === 0) {
      throw new Error(`User with ID ${id} not found`);
    }

    return result[0];
  } catch (error) {
    logger.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // First check if user exists
    await getUserById(id);

    // Add timestamp for updated_at
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date(),
    };

    const result = await db
      .update(users)
      .set(updatesWithTimestamp)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    if (result.length === 0) {
      throw new Error(`Failed to update user with ID ${id}`);
    }

    return result[0];
  } catch (error) {
    logger.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    // First check if user exists
    await getUserById(id);

    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (result.length === 0) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }

    return { id: result[0].id, message: 'User deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
