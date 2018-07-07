/**
 * Copyright 2018 IBM Deutschland. All Rights Reserved.
 *
 * Open Healthcare Platform (OHP) Demo Team
 * https://github.ibm.com/OHP
 */

import { HttpErrorResponse } from '@angular/common/http';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export function dateReviver<T>(propertyNames: string | string[]): OperatorFunction<T, T> {
  function modifyElement(element: {[key: string]: any}) {
    if (Array.isArray(propertyNames)) {
      propertyNames.forEach(property => {
        if (typeof element[property] === 'string') element[property] = new Date(String(element[property]));
      });
    } else {
      if (typeof element[propertyNames] === 'string') element[propertyNames] = new Date(String(element[propertyNames]));
    }
  }

  return map<T, T>(elements => {
    if (Array.isArray(elements)) elements.forEach(modifyElement);
    else modifyElement(elements);

    return elements;
  });
}

export enum ServiceErrorType {
  Network = 'Network',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  Conflict = 'Conflict',
  Server = 'Server',
  UnknownData = 'Unknown data structure',
  Unknown = 'Unknown',
}

export function handleError(operation: string = 'Default Operation'): (error: HttpErrorResponse) => Observable<never> {

  return (error: HttpErrorResponse | Error) => {
    if (error instanceof Error) {
      return throwError(error.message);
    }

    if (error.error instanceof ErrorEvent) {
      // tslint:disable-next-line:no-console
      console.error(`A client-side error occured during operation ${operation}:`, error.error.message);

      return throwError(ServiceErrorType.Network);
    } else {
      // tslint:disable-next-line:no-console
      console.error(`Backend send an unsuccessful response during operation ${operation}: Code ${error.status}, body was:`, error.error);

      if (error.status >= 500 && error.status < 600) return throwError(ServiceErrorType.Server);
      switch (error.status) {
        case 401:
          return throwError(ServiceErrorType.Unauthorized);
        case 403:
          return throwError(ServiceErrorType.Forbidden);
        case 409:
          return throwError(ServiceErrorType.Conflict);
        default:
          return throwError(ServiceErrorType.Unknown);
      }
    }
  };
}
