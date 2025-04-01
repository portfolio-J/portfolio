## Stopwatch 프로젝트

### 기능 구현

1. 스톱워치는 두 개의 버튼을 가진다.
2. 왼쪽은 `Start`와 `Stop`을, 오른쪽은 `Reset`과 `Lap`을 나타낸다.
3. `Start` 버튼을 누르면 타이머가 시작되고, `Stop`을 누르면 일시정지된다.
4. 타이머가 동작 중일 때는 오른쪽 버튼이 `Lap`로 바뀌고, 누르면 아래에 랩 타임이 추가된다.
5. `Reset` 버튼은 타이머가 정지 상태일 때만 활성화되고, 동작 중일 땐 비활성(disabled) 상태다.

---

### 구현 코드

#### 상태 타입

```ts
type StopWatchState = {
  time: number;
  buttons: {
    left: 'Start' | 'Stop';
    right: 'Lap' | 'Reset';
  };
  laps: string[];
};
```

상태는 `time`(시간), 버튼 상태를 담은 `buttons`, 저장된 랩 타임을 모은 `laps` 배열로 구성된다.

---

#### 타이머 로직

```ts
startTimer() {
  this.timeId = setInterval(() => {
    this.setState({
      time: this.state.time + 100,
      buttons: { left: 'Stop', right: 'Lap' },
    });
  }, 100);
}

stopTimer() {
  clearInterval(this.timeId!);
  this.setState({
    buttons: { left: 'Start', right: 'Reset' },
  });
}

resetTimer() {
  clearInterval(this.timeId!);
  this.setState({
    time: 0,
    buttons: {
      left: 'Start',
      right: 'Reset',
    },
    laps: [],
  });
}

recordLap() {
  const time = this.formatTime(this.state.time);
  this.setState({
    laps: [...this.state.laps, time],
  });
}
```

타이머 시작, 정지, 초기화, 랩 기록을 각각 담당하는 메서드다.  
상태 변경은 `setState`를 통해 이루어지고, 그에 따라 UI가 다시 렌더링된다.

---

### 시간 포맷 처리

```ts
formatTime(time: number): string {
  const pad = (num: number): string => String(num).padStart(2, '0');

  const minute = Math.floor(time / 60000);
  const second = Math.floor((time % 60000) / 1000);
  const millisecond = Math.floor((time % 1000) / 10);

  return `${pad(minute)}:${pad(second)}:${pad(millisecond)}`;
}
```

시간을 `mm:ss:ms` 형식으로 포맷팅하여 UI에 일관된 시간 표현을 보장한다.  
pasStart를 사용하여 가독성 좋게 리팩토링하였다.(이전에는 if를 사용)

---

### 트러블슈팅: 언마운트 시 타이머 제거

타이머가 작동 중일 때 다른 페이지로 이동하면 `setInterval`이 계속 유지되는 문제가 발생했다.  
이는 메모리 누수 및 중첩 실행을 유발하기 때문에 **컴포넌트 언마운트 시 타이머를 정리**해야 한다.

---

#### Stopwatch 컴포넌트 생성자에서 콜백 전달

```ts
super(
  {
    time: 0,
    buttons: {
      left: 'Start',
      right: 'Reset',
    },
    laps: [],
  },
  () => {
    clearInterval(this.timeId!); // 언마운트 시 타이머 제거
  },
);
```

`Component` 부모 클래스에 `onUnmount` 콜백을 전달하여 특정 페이지가 제거될 때 실행되도록 설정한다.

---

#### Component 클래스의 언마운트 로직

```ts
constructor(initalState?: S, onUnmount?: () => void) {
  this._state = { ...initalState } as S;
  this.holdEvents();
  this.onUnmount = onUnmount ?? (() => {});
}

unmount() {
  const $root = document.querySelector('#app');

  eventHolder.forEach(({ type, handler, selector }) => {
    if (selector === 'window' || selector === null) {
      window.removeEventListener(type, handler);
      return;
    }
    $root!.removeEventListener(type, handler);
  });

  eventHolder.length = 0;
  this.onUnmount(); // 전달받은 클린업 실행
}
```

`unmount()`는 이벤트를 해제하고, 전달된 언마운트 콜백을 실행하는 책임을 가진다.

---

### 마무리

✅ 상태와 버튼 상태를 명확하게 분리해서 관리했다.  
✅ Lap 기능은 배열로 관리하며 각 랩 타임을 렌더링한다.  
✅ 언마운트 처리로 타이머 누수를 방지하는 구조를 설계했다.
