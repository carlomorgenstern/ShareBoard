/**
 * Copyright 2018 IBM Deutschland. All Rights Reserved.
 *
 * Open Healthcare Platform (OHP) Demo Team
 * https://github.ibm.com/OHP
 */
import Koa from 'koa';
import KoaCsrf from 'koa-csrf';
import koaHelmet from 'koa-helmet';

import { processEnvironment } from './environment';

// helmet configuration types have not been updated to include "featurePolicy" yet, so use any for the config object
const helmetConfiguration: any = {
  contentSecurityPolicy: {
    browserSniff: false,
    directives: {
      blockAllMixedContent: true,
      defaultSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  dnsPrefetchControl: {
    allow: false,
  },
  expectCt: {
    maxAge: 86400, // seconds
  },
  featurePolicy: {
    features: {
      ...['fullscreen', 'geolocation', 'gyroscope', 'magnetometer', 'midi', 'notifications', 'payment', 'syncXhr', 'vibrate',
        ].reduce<{[key: string]: string[]}>((aggregate, policy) => {
          aggregate[policy] = ["'none'"];

          return aggregate;
        }, {}),

      ...['camera', 'microphone', 'push', 'speaker'].reduce<{[key: string]: string[]}>((aggregate, policy) => {
        aggregate[policy] = ["'self'"];

        return aggregate;
      }, {}),
    },
  },
  frameguard: {
    action: 'deny',
  },
  hidePoweredBy: true,
  hsts: {
    includeSubdomains : false,
    maxAge: 5184000, // seconds = 60 days
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  xssFilter: true,
};

export function configureSecurity(app: Koa): void {
  app.keys = [processEnvironment.COOKIE_SECRET];

  // if the NODE_ENV environment variable is set to production, assume that we are behind a trusted proxy server that handles HTTPS
  if (processEnvironment.NODE_ENV === 'production') {
    app.proxy = true;
    app.use(async (ctx, next) => {
      if (ctx.secure) return next();
      else ctx.redirect(`https://${ctx.host}${ctx.originalUrl}`);
    });
  }

  // tslint:disable-next-line:no-unsafe-any - see reasoning for config object
  app.use(koaHelmet(helmetConfiguration));

  // generate and check CSRF tokens with the middleware and set the needed token cookie for the frontend
  app.use(new KoaCsrf({
    disableQuery: true,
    excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  }));
  app.use(async (ctx, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(ctx.method)) {
      ctx.cookies.set('CSRF-Token', ctx.csrf, {
        httpOnly: false, // we want this csrf-cookie to be readable by the frontend
      });
    }

    return next();
  });
}
