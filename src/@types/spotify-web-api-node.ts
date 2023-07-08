export type Credentials = {
  accessToken?: string | undefined;
  clientId?: string | undefined;
  clientSecret?: string | undefined;
  redirectUri?: string | undefined;
  refreshToken?: string | undefined;
};

export interface SinglePlaylistResponse
  extends SpotifyApi.SinglePlaylistResponse {
  primary_color?: null;
}
