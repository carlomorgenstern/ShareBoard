import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import KoaRouter from 'koa-router';
import koaStatic from 'koa-static';

import { configureAuthentication } from './configuration/authentication';
import { setupDatabase } from './configuration/database';
import { processEnvironment } from './configuration/environment';
import { configureLogging, logger } from './configuration/logging';
import { configureSecurity } from './configuration/security';
import { configureSession } from './configuration/session';

import { userNameRouter, userRouter } from './api/user/user.api';

class Server {
  private readonly app = new Koa();
  private readonly router = new KoaRouter();

  async start(): Promise<Server> {
    this.app.on('error', error => logger.error('Koa error', {error}));
    this.app.use(koaBodyParser());

    configureLogging(this.app);
    configureSession(this.app);
    configureSecurity(this.app);
    configureAuthentication(this.app);

    await setupDatabase();

    this.registerRoutes();
    this.serveFrontend();

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    return new Promise<Server>((resolve, reject) => {
      const server = this.app.listen(processEnvironment.PORT, () => resolve(this));
      server.once('error', reject);
    });
  }

  private registerRoutes() {
    // authentication handling for the user endpoints is done in their file
    this.router.use('/api/v1/user', userRouter.routes(), userRouter.allowedMethods());
    this.router.use('/api/v1/user-name', userNameRouter.routes(), userNameRouter.allowedMethods());
  }

  private serveFrontend() {
    if (processEnvironment.NODE_ENV !== 'production') return;

    this.app.use(koaStatic('../frontend', {
      maxAge: 172800000, // ms = 2 days
      setHeaders: (response, path) => {
        if (path.includes('/index.html')) {
          response.setHeader('Cache-Control', 'max-age=10 must-revalidate'); // max-age in s
        } else if (path.includes('/assets/')) {
          response.setHeader('Cache-Control', 'max-age=172800 must-revalidate'); // max-age in s = 2 days
        }
      },
    }));
  }
}

new Server().start()
  .then(() => logger.info(`Server started successfully on port ${processEnvironment.PORT}`))
  .catch(error => logger.error('Server could not start', {error}));
