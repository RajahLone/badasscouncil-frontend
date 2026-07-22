
export class HomeInformation
{
  error: string = "";
  alert: string = "";
  info: string = "";
  other: string = "";
}

export class Pagination
{
  items:number = 0;
  size:number = 50;
  total:number = 1;
  current:number = 0;
}

export class Preference
{
  createdOn?: string;
  updatedOn?: string;
  preferenceId: number = 0;
  userId: number = 0;
  actionId: string = "";
  parameters: string = "";
}

export const USERS_PAGE_SIZE = 1;
