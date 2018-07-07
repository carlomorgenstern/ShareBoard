import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';
import { Observable, of, Subscriber } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { deserializeUser, isIUser, User } from '../../../../../shared/models/user';

import { handleError, ServiceErrorType } from '../util';

// tslint:disable-next-line:no-unsafe-any - false positive
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly authenticationEndpoint = '/auth';

  private _currentUser: User | undefined;
  private readonly currentUserSubscribers: Subscriber<User | undefined>[] = [];

  constructor (private readonly http: HttpClient) {}

  private get currentUser(): User | undefined {
    return this._currentUser;
  }

  private set currentUser(user: User | undefined) {
    this._currentUser = user;
    this.currentUserSubscribers.forEach(subscriber => subscriber.next(user));
  }

  static hashPassword(userName: string, password: string) {
    return sha512(password + userName);
  }

  login(userName: string, password: string): Observable<User> {
    return this.http.post<any>(this.authenticationEndpoint + '/login', {
      password: AuthenticationService.hashPassword(userName, password),
      user: userName,
    }).pipe(
      map<any, User>(iUser => {
        if (!isIUser(iUser)) throw new Error(ServiceErrorType.UnknownData);
        this.currentUser = deserializeUser(iUser);

        return this.currentUser;
      }),
      catchError(handleError('login')),
    );
  }

  logout(): Observable<void> {
    return this.http.post(this.authenticationEndpoint + '/logout', {}, { responseType: 'text' }).pipe(
      map<string, void>(() => {
        this.currentUser = undefined;
      }),
      catchError(handleError('logout')),
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const currentUser = this.currentUser;
    if (currentUser === undefined) return of(false);

    return this.http.post<void>(this.authenticationEndpoint + '/change-password', {
      new: AuthenticationService.hashPassword(currentUser.name, newPassword),
      old: AuthenticationService.hashPassword(currentUser.name, oldPassword),
    }).pipe(
      map<void, boolean>(() => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return of(false);
        else throw error;
      }),
      catchError(handleError('changePassword')),
    );
  }

  getCurrentUser(): Observable<User | undefined> {
    return new Observable<User | undefined>(subscriber => {
      this.currentUserSubscribers.push(subscriber);
      subscriber.next(this.currentUser);

      return () => {
        this.currentUserSubscribers.splice(this.currentUserSubscribers.indexOf(subscriber), 1);
      };
    });
  }

  updateUserData(): Observable<User> {
    return this.http.get<any>(this.authenticationEndpoint + '/current').pipe(
      map<any, User>(iUser => {
        if (!isIUser(iUser)) throw new Error(ServiceErrorType.UnknownData);
        this.currentUser = deserializeUser(iUser);

        return this.currentUser;
      }),
      catchError(handleError('updateUserData')),
    );
  }

  clearUserData(): void {
    this.currentUser = undefined;
  }
}
