export const call = (arg: string, fail: boolean = false) => {
  return new Promise<string>(((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject('fail on request');
        return;
      }
      resolve('as promised ' + arg);
    }, 500);
  }));
};