export interface IPageObject {
  id: string;
  data: {
    [key: string]: any;
  };
}

export function isIPageObject(pageObject: any): pageObject is IPageObject {
  if (pageObject == undefined) return false;
  const test = pageObject as {[key: string]: any};

  return typeof test.id === 'string'
    && test.data != undefined;
}
