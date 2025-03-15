## Counter 프로젝트

### 기능 구현

간단한 카운터 프로젝트를 제작하며 다음과 같은 기능을 구현했다.

1. `decrease`와 `increase` 버튼을 만들었다.
2. 클릭 이벤트를 통해 해당 버튼에 맞게 `counter` 값을 증가/감소시킨다.

---

### 구현 코드

```ts
updateCounterHandler(e: Event) {
  const target = e.target as HTMLElement;

  if (target.closest(`.${st.decrease}`) && this.state.counter > 0) {
    this.setState({ counter: --this.state.counter });
  }

  if (target.closest(`.increase`)) {
    this.setState({ counter: ++this.state.counter });
  }
}
```

➡️ 클릭 이벤트를 `container` 요소에 위임하여, 버튼 클릭 여부를 `closest()`로 확인한다.  
➡️ `decrease`는 `counter`가 0보다 클 경우에만 감소하도록 조건을 추가했다.  
➡️ `setState()`를 호출하여 상태를 업데이트하고, 변경된 값을 기준으로 리렌더링이 일어난다.

---

### 추가 사항

#### 스타일 관리 개선 및 파일 구조 변경

처음에는 `scroll` 컴포넌트와 `counter` 컴포넌트의 스타일이 충돌하는 문제가 있었다.  
`scroll`과 `counter`에서 동일한 클래스명(`.container`, `.title` 등)을 사용하면서 전역 스타일로 적용되었기 때문이다.

기존 방식은 아래와 같다.

```ts
import './counter.scss';
```

➡️ 이 방식은 전역 CSS로 작동해서, 다른 컴포넌트와 네임스페이스가 겹쳐 충돌이 발생했다.

---

#### 개선 방법

1. Sass 파일을 `counter.module.scss`로 변경하여 **CSS Modules**를 적용했다.
2. `Counter.ts`에서 다음과 같이 import하여 스타일을 모듈화했다.

```ts
import st from './counter.module.scss';
```

➡️ 이 방식으로 클래스명이 **고유하게 해시 처리**되어 중복되지 않는다.  
➡️ 개발자 도구에서 확인하면 다음과 같은 클래스명이 자동으로 생성된다.

```html
<section class="_container_1fqq6_300"></section>
```

➡️ 이로 인해 `scroll`과 `counter` 컴포넌트의 스타일 충돌을 해결할 수 있었다.

---

### 최종 렌더링 코드

```ts
render() {
  return html`
    <h1 class="${st.title}">Counter</h1>
    <section class="${st.container}">
      <button class="${st.decrease}"><span>-</span></button>
      <span class="${st.counter}">${this.state.counter ? this.state.counter : '0'}</span>
      <button class="${st.increase} increase"><span>+</span></button>
    </section>
  `;
}
```

➡️ `${st.container}`와 같이 모듈화된 클래스를 사용하면  
➡️ CSS가 전역으로 오염되지 않고, 클래스명이 충돌하지 않는다.

---

### 이벤트 핸들러에서도 CSS Modules 사용

스타일 클래스명을 선택자로 사용하는 경우에도 `st.container`를 활용한다.

예시:

```ts
this.$target.querySelector(`.${st.container}`);
```

➡️ 이 방식은 하드코딩된 클래스명(`.container`)을 제거하고  
➡️ `CSS Modules`가 자동으로 변환한 클래스명을 안전하게 사용할 수 있게 한다.

---

### 트러블슈팅 정리

✅ 컴포넌트 별 스타일은 **CSS Modules**로 관리하여 전역 충돌을 방지한다.  
✅ 이벤트 위임을 통해 효율적인 이벤트 핸들링을 구현하고, 조건문으로 상태값 제한을 관리한다.  
✅ 파일 구조는 컴포넌트와 스타일을 같은 폴더에 배치하여 유지보수성을 높인다.
