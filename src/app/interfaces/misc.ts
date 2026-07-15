
export class Message
{
  erreur: string = "";
  alerte: string = "";
  information: string = "";
  autre: string = "";
}

export class Pagination
{
  items:number = 0;
  size:number = 100;
  total:number = 1;
  current:number = 0;
}
