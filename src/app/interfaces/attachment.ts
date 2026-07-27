
export class Attachment
{
  fileId: number = 0;
  ownerId: number = 0;
  commentsPublic: string = "";
  commentsPrivate: string = "";
  archiveName: string = "";
  versionNumber: number = 0;
  shared: boolean = false;
}

export class AttachmentShort
{
  createdOn?: string;
  updatedOn?: string;
  fileId: number = 0;
  ownerId: number = 0;
  ownerName: string = "";
  IpAddress: string = "";
  commentsPublic: string = "";
  commentsPrivate: string = "";
  archiveName: string = "";
  versionNumber: number = 0;
  shared: boolean = false;
  destId: number = 0;
}

export class AttachmentItem
{
  fileId: number = 0;
  ownerId: number = 0;
  archiveName: string = "";
  archive!: string | any;
}

export class AttachmentCount
{
  current: number = 0;
  maximum: number = 0;
}
