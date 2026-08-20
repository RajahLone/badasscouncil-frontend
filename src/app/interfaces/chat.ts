export class MessageShort
{
  createdOn: string = "";
  messageId: number = 0;
  nickName: string = "";
  content: string = "";
  destId: number = 0;
  destName: string = "";
}

export class RoomEnum { key!: string; value!: string; }

export const RoomState: RoomEnum[] =
[
  { key: "ACTIVE", value: $localize`Active`},
  { key: "LOCKED", value: $localize`Locked`},
  { key: "TRASHED", value: $localize`Trashed`},
];

export const RoomPurgeMethod: RoomEnum[] =
[
  { key: "NEVER", value: $localize`Never`},
  { key: "MESSAGES_LIMITED", value: $localize`Messages limited`},
  { key: "TIME_LIMITED", value: $localize`Time limited`},
  { key: "WHEN_DEPOPULATED", value: $localize`When depopulated`},
];

export class Room
{
  createdOn?: string;
  updatedOn?: string;
  roomId: number = 0;
  name: string = "";
  state: string = "ACTIVE";
  ownerId: number = 0;
  password: string = "";
  topic: string = ""; ;
  purgeMethod: string = "NEVER";
  messagesLimit: number = 1000;
  timeDuration: number = 4321;
}
