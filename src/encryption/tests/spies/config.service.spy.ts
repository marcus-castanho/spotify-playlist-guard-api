export const ConfigServiceSpy = {
  get: jest.fn((envVar: string) => {
    return envVar === 'ENCRYPTION_PASSWORD'
      ? 'any_encryption_password'
      : undefined;
  }),
};
