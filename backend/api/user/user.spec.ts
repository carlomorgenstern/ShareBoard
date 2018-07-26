// tslint:disable:no-import-side-effect no-implicit-dependencies no-unused-expression
import 'mocha';

import { expect } from 'chai';

import { userNameRouter, userRouter } from './user.api';

describe('User API', () => {
  describe('User router', () => {
    it('should be truthy', () => {
      expect(userRouter).to.be.ok;
    });
  });

  describe('Username router', () => {
    it('should be truthy', () => {
      expect(userNameRouter).to.be.ok;
    });
  });
});
