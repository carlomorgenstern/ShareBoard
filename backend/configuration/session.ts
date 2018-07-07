import Koa from 'koa';
import koaSession from 'koa-session';

// Implementation of an in-memory session store with timeouts
class MemorySessionStore implements koaSession.stores {
  private readonly dataStore = new Map<string, Partial<koaSession.Session>>();
  private readonly timeoutStore = new Map<string, NodeJS.Timeout | undefined>();

  get(key: string, maxAge: number | 'session' | undefined, data: { rolling: boolean | undefined }) {
    if (data.rolling === true) {
      const timeout = this.timeoutStore.get(key);
      if (timeout !== undefined) clearTimeout(timeout);
      this.timeoutStore.set(key, this.getTimeout(key, maxAge));
    }

    return this.dataStore.get(key);
  }

  set(key: string, session: Partial<koaSession.Session>, maxAge: number | 'session' | undefined,
      data: { rolling: boolean | undefined; changed: boolean | undefined }) {

    const timeout = this.timeoutStore.get(key);
    if (data.rolling === true) {
      if (timeout !== undefined) clearTimeout(timeout);
      this.timeoutStore.set(key, this.getTimeout(key, maxAge));
    }

    if (data.changed === true) {
      if (timeout === undefined) this.timeoutStore.set(key, this.getTimeout(key, maxAge));
      this.dataStore.set(key, session);
    }
  }

  destroy(key: string) {
    this.dataStore.delete(key);
    const timeout = this.timeoutStore.get(key);
    if (timeout !== undefined) clearTimeout(timeout);
    this.timeoutStore.delete(key);
  }

  private getTimeout(key: string, maxAge: number | 'session' | undefined) {
    if (maxAge === 'session' || maxAge === undefined) return undefined;

    return setTimeout(() => this.destroy(key), maxAge);
  }
}

export function configureSession(app: Koa): void {
  // tslint:disable-next-line:no-object-literal-type-assertion
  app.use(koaSession({
    key: 'session-id',
    maxAge: 86400000,
    renew: true,
    sameSite: 'strict',
    store: new MemorySessionStore(),
  } as Partial<koaSession.opts>, app));
}
