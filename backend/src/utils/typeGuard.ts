const isString = (value: unknown): value is string =>
  typeof value === 'string' || value instanceof String;

const parseString = (value: unknown): string => {
  if (!isString(value)) {
    throw new Error('Incorrect or missing string');
  }

  return value;
};

export default { parseString };
