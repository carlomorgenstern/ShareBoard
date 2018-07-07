export enum UserPermission {
  EditUsers = 'editUsers',
}

export const userPermissions: UserPermission[] = Object.values(UserPermission);

export enum RoomPermission {
  EditPermissions = 'editPermissions',
  CreatePage = 'createPage',
}

export const roomPermissions: RoomPermission[] = Object.values(RoomPermission);
