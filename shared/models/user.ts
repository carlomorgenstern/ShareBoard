import { UserPermission, userPermissions } from '../permissions';

export interface IUser {
  id: string;
  name: string;
  displayName: string;
  permissions: UserPermission[];
}

export interface IUserWithPassword extends IUser {
  password: string;
}

export class User implements IUser {
  constructor (
    public id: string,
    public name: string,
    public displayName: string,
    public permissions: UserPermission[],
  ) {}

  hasPermission(permission: UserPermission): boolean {
    return this.permissions.includes(permission);
  }
}

export class UserWithPassword extends User implements IUserWithPassword {
  constructor (
    public id: string,
    public name: string,
    public displayName: string,
    public permissions: UserPermission[],
    public password: string,
  ) {
    super(id, name, displayName, permissions);
  }
}

export function deserializeUser(user: IUser): User {
  return new User(user.id, user.name, user.displayName, user.permissions);
}

export function deserializeUserWithPassword(user: IUserWithPassword): UserWithPassword {
  return new UserWithPassword(user.id, user.name, user.displayName, user.permissions, user.password);
}

export function isIUser(user: any): user is IUser {
  if (user == undefined) return false;
  const test = user as {[key: string]: any};

  return typeof test.id === 'string'
    && typeof test.name === 'string'
    && typeof test.displayName === 'string'
    && Array.isArray(test.permissions) && test.permissions.every((permission: any) => userPermissions.includes(permission as UserPermission));
}

export function isIUserWithPassword(user: any): user is IUserWithPassword {
  if (user == undefined) return false;
  const test = user as {[key: string]: any};

  return typeof test.password === 'string'
    && isIUser(test);
}
