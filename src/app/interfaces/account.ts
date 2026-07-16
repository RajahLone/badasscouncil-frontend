
export class Account
{
  userId: number = 0;
  loginName: string = "";
  password: string = "";
  nickName: string = "";
  groupName: string = "";
  role: string = "";
  sessionTimeout: number = 15;
  accessToken: string = "";
  refreshToken: string = "";
  error: string = "";
}

export class RefreshToken
{
  accessToken: string = "";
  refreshToken: string = "";
}

export class NewPassword
{
  nickName: string = "";
  oldPassword: string = "";
  newPassword: string = "";
  error: string = "";
  success: string = "";
}
