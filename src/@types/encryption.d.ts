export type EncryptedData = {
  iv: string;
  encryptedData: string;
};

export type Tokens = {
  accessToken: string;
  ivAccessToken: string;
  refreshToken: string;
  ivRefreshToken: string;
};
