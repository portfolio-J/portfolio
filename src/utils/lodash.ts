//사용자가 상호작용을 할떄 과도한 이벤트 호출을 방지하기 위해서 디바운스와,스로틀을 사용한다.

/**
 * 사용자가 입력후 일정시간이 지나야만 동작한다.
 * 일정시간이 지나기 전에 다시 실행하면 동작하지 않는다.
 *
 * ex) input에 입력할때 서버에 요청하는 작업이 필요할 경우 필요하다.
 * @returns
 */
const debounce = (callback: any, delay: number) => {
  let timeId: number | NodeJS.Timeout;

  return (...args: any[]) => {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 * 사용자가 입력하기 시작하면 일정시간마다 동작한다.
 * ex) 스크롤 이벤트에 적합하다.
 */
const throttle = (callback: any, delay: number) => {
  let lastTime: number = 0;

  return (...args: any) => {
    let now: number = Date.now();

    if (now - lastTime >= delay) {
      callback(...args);
      lastTime = now;
    }
  };
};

export { debounce, throttle };
