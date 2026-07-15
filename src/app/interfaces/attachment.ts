
export class Attachment
{
  fileId: number = 0;
  commentsPublic: string = "";
  commentsPrivate: string = "";
  ownerId: number = 0;
  archiveName: string = "";
  versionNumber: number = 0;
}

export class AttachmentShort
{
  createdOn?: string;
  updatedOn?: string;
  fileId: number = 0;
  commentsPublic: string = "";
  commentsPrivate: string = "";
  ownerId: number = 0;
  ownerName: string = "";
  IpAddress: string = "";
  archiveName: string = "";
  versionNumber: number = 0;
}

export class AttachmentItem
{
  fileId: number = 0;
  ownerId: number = 0;
  archiveName: string = "";
  archive!: string | any;
}
