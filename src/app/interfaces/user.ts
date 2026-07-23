export class UserEnum { key!: string; value!: string; }

export const RoleList: UserEnum[] =
[
  { key: "ADMIN", value: $localize`Administrator`},
  { key: "REGUL", value: $localize`Regulator`},
  { key: "USER", value: $localize`Member`},
];

export const UserStatusList: UserEnum[] =
[
  { key: "ACTIVE", value: $localize`Active`},
  { key: "PENDING", value: $localize`Pending`},
  { key: "LOCKED", value: $localize`Locked`},
  { key: "BANNED", value: $localize`Banned`},
  { key: "SLEEPING", value: $localize`Sleeping`},
];

export class User
{
  createdOn?: string;
  updatedOn?: string;
  userId: number = 0;
  role: string = "";
  status: string = "PENDING";
  loginName: string = "";
  password: string = "";
  sessionTimeout: number = 15;
  lastActivityOn?: string;
  subscribeMotive: string = "";
  nickName: string = "";
  groupName: string = "";
  firstName: string = "";
  lastName: string = "";
  displayContactDetails: boolean = false;
  address: string = "";
  zipCode: string = "";
  town: string = "";
  country: string = "";
  phone: string = "";
  email: string = "";
  answer: string = "";
}

export class UserShort
{
  userId: number = 0;
  status: string = "PENDING";
  nickName: string = "";
  groupName: string = "";
  firstName: string = "";
  lastName: string = "";
  email: string = "";
}

export class NickName
{
  userId: number = 0;
  nickName: string = "";
  groupName: string = "";
}


export class UserCount
{
  current: number = 0;
  maximum: number = 0;
}
