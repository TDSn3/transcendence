// interface/IntraUserData.tsx

export default interface IntraUserData {
  created: number,
  accessToken: string,
  TwoFactorAuthSecret: string,
  isTwoFactorEnabled: boolean,
  intraId: number,
  email42: string,
  login: string,
  firstName: string,
  lastName: string,
  avatar: string,
  status: string,
}
