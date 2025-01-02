export function waitForValue<T>(
  predicate: () => T | void | undefined | null | false | 0 | "",
  interval: number = 100
): Promise<T> {
  let resolve: (value: T) => void;
  let promise: Promise<T> = new Promise((_resolve) => {
    resolve = _resolve;
  });
  let value;
  let timer = setInterval(() => {
    if ((value = predicate())) {
      resolve(value);
      clearInterval(timer);
    }
  }, interval);
  return promise;
}
