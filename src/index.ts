export const hello = (name: string): string => `Hello ${name}`;


export const asyncFunction = async (input: string, success: boolean = true) => {
  return new Promise<string>((resolve, reject) => {
    if(success){
      resolve(`${input} resolve`);
      return;
    }

    reject(new Error('rejected as requested'))
  });
};

export const callbackFunction = (callback: (value: string) => void, invoke: boolean = true): void => {
  if (invoke) {
    callback('hello from the callback');
  }
};