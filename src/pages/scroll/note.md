## Scroll 프로젝트

스크롤로 상호작용하는 미니 프로젝트를 만들었다.

---

### 기능 구현

1. `scrollY`가 `300`보다 크거나 같으면 스크롤 아이콘이 보인다.
2. `300`보다 작으면 아이콘이 사라진다.
3. `throttle`을 사용해 과도한 이벤트 호출을 막는다.

---

### 구현 코드

```ts
showIconHandler() {
  if (!this.$scroll) this.$scroll = document.querySelector('.icon-scroll');

  this.$scroll!.style.display =
    window.scrollY >= this.TOP_TO_START_SHOWING ? 'block' : 'none';
}

scrollToTopHandler() {
  console.log('click');
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
```

- `300`을 상수로 할당하고 `window.scrollY`를 이용해 현재 스크롤 위치를 판단하여 `$scroll` 아이콘의 `display`를 결정했다.
- 아이콘을 클릭 시 최상단으로 이동하기 위해 `window.scrollTo()` 메서드를 사용하고, 옵션으로 `smooth`를 추가해 부드러운 스크롤 이동을 완성했다.

---

## 기능 추가

디바운스와 스로틀을 만들어 이벤트 동작을 컨트롤한다.

```ts
// 사용자가 상호작용할 때 과도한 이벤트 호출을 방지하기 위해 디바운스와 스로틀을 사용한다.

/**
 * 사용자가 입력 후 일정 시간이 지나야만 동작한다.
 * 일정 시간이 지나기 전에 다시 실행하면 동작하지 않는다.
 *
 * ex) input에 입력할 때 서버에 요청하는 작업이 필요할 경우 사용
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
 * 사용자가 입력하기 시작하면 일정 시간마다 동작한다.
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
```

---

## 문제 발생 및 해결

```ts
protected addEventListeners(): EventHandler[] {
  return [
    {
      type: 'scroll',
      selector: 'window',
      handler: throttle(this.showIconHandler.bind(this), 100)
    },
    {
      type: 'click',
      selector: '.icon-scroll',
      handler: this.scrollToTopHandler
    }
  ];
}
```

- `throttle`에 `showIconHandler`를 넘길 때 `this`를 잃어버리는 현상 발생
- `this`는 어떻게 호출되느냐에 따라 달라진다
- `throttle` 안에서 호출될 때 `this`가 `window`를 가리키게 되어버리는 현상이 발생했기 때문에 `bind`로 고정했다.

> 참고:  
> `bind`를 사용하면 **새로운 함수가 만들어진다**.  
> 따라서 `this.showIconHandler === this.showIconHandler.bind(this)`는 `false`다.

---

### 수정사항

상태로 dom을 조작한다는 기존 프로젝트의 생각과 다르게 dom을 queryselector로 불러와 직접 조작하고 있었다.
그래서 다시 state를 초기화하고 render()를 호출해 리렌더링하는 방식으로 고쳤다.

```
 showIconHandler() {
    if (window.scrollY >= this.TOP_TO_START_SHOWING && !this.state.isVisible) this.setState({ isVisible: true });
    if (window.scrollY < this.TOP_TO_START_SHOWING && this.state.isVisible) {
      this.setState({ isVisible: false });
    }
  }
```

불필요한 리렌더링을 방지하기 위해 this.state.isVisible 조건문을 추가
