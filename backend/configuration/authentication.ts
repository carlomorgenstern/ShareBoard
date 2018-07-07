import * as bcrypt from 'bcrypt';
import Koa, { Middleware } from 'koa';
import koaPassport from 'koa-passport';
import KoaRouter from 'koa-router';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../../shared/models/user';

import { UserPermission } from '../../shared/permissions';
import { getUserDb } from '../api/user/user.db';

export function configureAuthentication(app: Koa): void {
  koaPassport.serializeUser<User, string>((user, done) => {
    done(undefined, user.id);
  });

  koaPassport.deserializeUser<User, string>(async (userId, done) => {
    const user = await (await getUserDb()).getUser(userId);

    if (user === undefined) done('User could not be deserialized from session');
    else done(undefined, user);
  });

  koaPassport.use('local', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
  }, async (username, password, done) => {
    const userDb = await getUserDb();
    const passwordHash = await userDb.getPasswordByName(username);

    if (passwordHash === undefined) {
      done(undefined, false);
    } else if (await bcrypt.compare(password, passwordHash)) {
      done(undefined, await userDb.getUserByName(username));
    } else {
      done(undefined, false);
    }
  }));

  app.use(koaPassport.initialize());
  app.use(koaPassport.session());

  const authRouter = new KoaRouter({
    prefix: '/auth',
  });

  authRouter.post('/login', koaPassport.authenticate('local'), ctx => {
    if (!isStateWithUser(ctx.state)) {
      ctx.status = 401;
    } else {
      ctx.body = ctx.state.user;
    }
  });

  authRouter.post('/logout', ctx => {
    ctx.logout();
    ctx.status = 200;
  });

  authRouter.get('/current', ctx => {
    if (!isStateWithUser(ctx.state)) {
      ctx.status = 401;
    } else {
      ctx.body = ctx.state.user;
    }
  });

  authRouter.post('/change-password', async ctx => {
    const data = ctx.request.body as {[key: string]: any} | null | undefined;
    if (data == undefined || typeof data.old !== 'string' || typeof data.new !== 'string') {
      ctx.status = 400;

      return;
    }

    if (!isStateWithUser(ctx.state)) {
      ctx.status = 401;

      return;
    }

    const userDb = await getUserDb();
    const savedPassword = await userDb.getPasswordByName(ctx.state.user.name);
    if (savedPassword === undefined || !(await bcrypt.compare(data.old, savedPassword))) {
      ctx.status = 401;

      return;
    }

    const isUpdated = await userDb.updatePassword(ctx.state.user.id, await encryptUserPassword(data.new));
    ctx.status = isUpdated ? 204 : 404;
  });

  app.use(authRouter.routes());
  app.use(authRouter.allowedMethods());
}

export async function encryptUserPassword(userPassword: string): Promise<string> {
  const bcryptCost = 12;

  return bcrypt.hash(userPassword, bcryptCost);
}

export const isAuthenticated: Middleware = (ctx, next) => {
  if (!isStateWithUser(ctx.state)) return ctx.status = 401;
  else return next();
};

export function hasPermission(requiredPermission: UserPermission): Middleware {
  return (ctx, next) => {
    if (!isStateWithUser(ctx.state)) return ctx.status = 401;
    else if (!ctx.state.user.hasPermission(requiredPermission)) return ctx.status = 403;
    else return next();
  };
}

export function isStateWithUser(state: any): state is { user: User; [key: string]: any } {
  if (state == undefined) return false;
  if ((state as {[key: string]: any}).user instanceof User) return true;

  return false;
}
