import { IPage, isIPage } from './page';
import { deserializeRoomUser, IRoomUser, isIRoomUser, RoomUser } from './room-user';

export interface IRoom {
  id: string;
  name: string;
  inviteToken: string | undefined;
  pages: IPage[];
  users: IRoomUser[];
}

export class Room implements IRoom {
  constructor (
    public id: string,
    public name: string,
    public inviteToken: string | undefined,
    public pages: IPage[],
    public users: RoomUser[],
  ) {}
}

export function deserializeRoom(room: IRoom): Room {
  const users = room.users.map(deserializeRoomUser);

  return new Room(room.id, room.name, room.inviteToken, room.pages, users);
}

export function isIRoom(room: any): room is IRoom {
  if (room == undefined) return false;
  const test = room as {[key: string]: any};

  return typeof test.id === 'string'
    && typeof test.name === 'string'
    && (test.inviteToken === undefined || typeof test.inviteToken === 'string')
    && Array.isArray(test.pages) && test.pages.every(isIPage)
    && Array.isArray(test.users) && test.users.every(isIRoomUser);
}
