export type BaseApiResponse = {
  id: number;
  created_at: string;
  updated_at: string;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};
export type LoginRequest={
  email:string;
  password:string;
}
export type LoginResponse={
  access_token:string;
  refresh_token:string;
}