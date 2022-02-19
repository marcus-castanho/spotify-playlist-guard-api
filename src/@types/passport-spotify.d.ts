export type AuthInfo = {
  accessToken: string;
  refreshToken: string;
  expires_in: number;
};

export type ProfileJson = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  href: string;
  id: string;
  images: [{ height: null; url: string; width: null }];
  product: string;
  type: string;
  uri: string;
};
