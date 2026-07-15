export class Variable
{
  createdOn?: string;
  updatedOn?: string;
  variableId: number = 0;
  family: string = "";
  code: string = "";
  content: string = "";
  notes: string = "";
}

export class VariableFamily
{
  family: string = "";
}
