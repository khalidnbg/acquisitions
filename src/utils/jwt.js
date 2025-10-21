import pkg from 'jsonwebtoken';
import logger from '#config/logger.js';

const { sign, verify } = pkg;

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error('Failed to sign token', e);
      throw new Error('Failed to sign token');
    }
  },

  verify: token => {
    try {
      return verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Failed to verify token', e);
      throw new Error('Failed to verify token');
    }
  },
};
