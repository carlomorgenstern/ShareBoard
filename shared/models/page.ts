import { IPageObject, isIPageObject } from './page-object';

export interface IPage {
  name: string;
  objects: IPageObject[];
}

export function isIPage(page: any): page is IPage {
  if (page == undefined) return false;
  const test = page as {[key: string]: any};

  return typeof test.name === 'string'
    && Array.isArray(test.objects) && test.objects.every(isIPageObject);
}
