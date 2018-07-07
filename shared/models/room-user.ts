import { RoomPermission, roomPermissions } from '../permissions';

export enum InviteStatus {
  None = 'none',
  Pending = 'pending',
  Accepted = 'accepted',
}

export const inviteStatuses = Object.values(InviteStatus);

export interface IRoomUser {
  id: string;
  inviteStatus: InviteStatus;
  permissions: RoomPermission[];
}

export class RoomUser implements IRoomUser {
  constructor (
    public id: string,
    public inviteStatus: InviteStatus,
    public permissions: RoomPermission[],
  ) {}
}

export function deserializeRoomUser(user: IRoomUser): RoomUser {
  return new RoomUser(user.id, user.inviteStatus, user.permissions);
}

export function isIRoomUser(user: any): user is IRoomUser {
  if (user == undefined) return false;
  const test = user as {[key: string]: any};

  return typeof test.id === 'string'
    && inviteStatuses.includes(test.inviteStatus)
    && Array.isArray(test.permissions) && test.permissions.every((permission: any) => roomPermissions.includes(permission as RoomPermission));
}
