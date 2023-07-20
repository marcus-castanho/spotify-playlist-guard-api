export type User = {
  id: string;
  displayName: string;
  avatar?: {
    sources: {
      url: string;
      width: number;
      height: number;
    }[];
  } | null;
};
