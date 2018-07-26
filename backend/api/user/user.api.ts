import Koa from 'koa';
import KoaRouter from 'koa-router';
import { v4 as uuid } from 'uuid';

import { deserializeUser, deserializeUserWithPassword, isIUser, isIUserWithPassword } from '../../../shared/models/user';
import { UserPermission } from '../../../shared/permissions';
import { encryptUserPassword, hasPermission, isAuthenticated, isStateWithUser } from '../../configuration/authentication';
import { getUserDb } from './user.db';

export const userRouter = new KoaRouter();
export const userNameRouter = new KoaRouter();

userRouter.get('/', hasPermission(UserPermission.EditUsers), async ctx => {
  const users = await (await getUserDb()).getUsers();

  ctx.body = users;
});

userNameRouter.get('/', isAuthenticated, async ctx => {
  const startsWith = (ctx.query as {[key: string]: any}).startsWith;

  const userNames = await (await getUserDb()).getUserNames(typeof startsWith === 'string' ? startsWith : undefined);

  ctx.body = userNames;
});

userRouter.post('/', async ctx => {
  const iUser = ctx.request.body;
  if (!isIUserWithPassword(iUser)) {
    ctx.status = 400;

    return;
  }

  const user = deserializeUserWithPassword(iUser);
  user.id = uuid();
  user.password = await encryptUserPassword(user.password);

  const isCreated = await (await getUserDb()).createUser(user);
  ctx.status = isCreated ? 201 : 409;
  if (isCreated) ctx.body = user.id;
});

userRouter.get('/:userId', isAuthenticated, async ctx => {
  const userId = (ctx.params as {[key: string]: any}).userId;
  if (typeof userId !== 'string') {
    ctx.status = 400;

    return;
  }

  const user = await (await getUserDb()).getUser(userId);
  if (user === undefined) {
    ctx.status = 404;
  } else {
    ctx.body = user;
  }
});

userRouter.put('/:userId', isAuthenticated, async ctx => {
  const userId = (ctx.params as {[key: string]: any}).userId;
  if (typeof userId !== 'string') {
    ctx.status = 400;

    return;
  }

  if (!isAllowedToEditUser(ctx, userId)) {
    ctx.status = 403;

    return;
  }

  const iUser = ctx.request.body;
  if (!isIUser(iUser)) {
    ctx.status = 400;

    return;
  }
  const user = deserializeUser(iUser);
  user.id = userId;

  const isUpdated = await (await getUserDb()).updateUser(user);
  ctx.status = isUpdated ? 204 : 404;
});

userRouter.delete('/:userId', async ctx => {
  const userId = (ctx.params as {[key: string]: any}).userId;
  if (typeof userId !== 'string') {
    ctx.status = 400;

    return;
  }

  if (!isAllowedToEditUser(ctx, userId)) {
    ctx.status = 403;

    return;
  }

  const isDeleted = await (await getUserDb()).deleteUser(userId);
  ctx.status = isDeleted ? 204 : 404;
});

function isAllowedToEditUser(ctx: Koa.Context, editUserId: string): boolean {
  if (!isStateWithUser(ctx.state)) return false;
  const loggedInUser = ctx.state.user;

  return loggedInUser.hasPermission(UserPermission.EditUsers) || loggedInUser.id === editUserId;
}
