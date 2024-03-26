import { User } from './types';

const isString = (value: unknown): value is string => (typeof value === 'string' || value instanceof String);

const parseString = (value: unknown): string => {
  if (!isString(value)) {
    throw new Error('Incorrect or missing string');
  }

  return (value);
};

function isUser(obj: unknown): obj is User {
  if (typeof obj === 'object' && obj !== null) {
    const user = obj as User;
    return (
      typeof user.id === 'string'
      && typeof user.createdAt === 'number'
      && typeof user.updatedAt === 'number'
      && typeof user.TwoFactorAuthSecret === 'string'
      && typeof user.isTwoFactorAuthEnabled === 'boolean'
      && typeof user.intraId === 'number'
      && typeof user.email42 === 'string'
      && typeof user.login === 'string'
      && typeof user.firstName === 'string'
      && typeof user.lastName === 'string'
      && typeof user.avatar === 'string'
      && 'status' in user
      && typeof user.accessToken === 'string'
    );
  }

  return (false);
}

function parseUser(user: unknown): User {
  if (!isUser(user)) {
    throw new Error('Incorrect or missing User');
  }

  return (user);
}

export default { parseString, parseUser };
