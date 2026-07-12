const throttle = <T extends unknown[]> (callback: (...args: T) => void, delay: number) => {
  let isWaiting = false;
 
  return (...args: T) => {
    if (isWaiting) {
      return;
    } 
    callback(...args);
    isWaiting = true;
 
    setTimeout(() => {
      isWaiting = false;
    }, delay);
  };
};

function debounce<T extends Function>(func: T, delay: number): (...args: any[]) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function(this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export {throttle, debounce};