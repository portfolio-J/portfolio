# TroubleShooting

[1. Postcss 적용](#1-postcss-적용)  
[2. SVG 업데이트(캐시문제)](#2-svg-업데이트-캐시-문제)  
[3. this 바인딩](#3-this-바인딩-문제-페이지-전환과-이벤트-핸들러)

## 1. PostCSS 적용

다양한 브라우저의 호환성을 위해 **PostCSS**를 사용하기로 했다.  
**PostCSS**는 CSS **후처리기(Post-Processor)**로, 이미 완성된 CSS 코드를 추가적으로 변환한다.  
즉, **벤더 프리픽스를 일일이 추가할 필요 없이 자동으로 변환해 주는 장점**이 있다.

---

위 명령어를 실행하여 PostCSS와 관련 플러그인을 설치한 후,
postcss.config.js 파일을 생성하고 다음과 같이 설정했다.

```
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [autoprefixer(), postcssPresetEnv({ stage: 1 })],
};
```

그리고 vite.config.ts 파일에서 PostCSS 설정을 추가했다.

```
export default defineConfig({
  ...
  css: {
    postcss: './postcss.config.js',
  },
  ...
});
```

📌 하지만 npm run build를 실행한 후 번들링된 CSS 파일을 확인했을 때, -webkit- 같은 프리픽스가 적용되지 않았다.
이 때문에 PostCSS가 정상적으로 동작하지 않는다고 생각했다.

---

🟢 해결 방법

문제의 원인은 PostCSS가 적용되지 않은 것이 아니라, 최신 브라우저가 프리픽스를 필요로 하지 않았기 때문이었다.

    최신 브라우저는 이미 많은 CSS 속성을 기본 지원하기 때문에, PostCSS가 프리픽스를 자동으로 추가하지 않음.

📌 따라서, package.json의 browserslist 설정을 추가하여 지원할 브라우저 범위를 명확하게 지정했다.

```
"browserslist": [
  "> 0.2%",         // 전 세계 점유율 0.2% 이상인 브라우저 지원
  "last 5 versions", // 각 브라우저의 최근 5개 버전 지원
  "Firefox ESR",    // Firefox의 장기 지원 버전(ESR) 지원
  "not dead",       // 더 이상 업데이트되지 않는 브라우저 제외
  "ie >= 10",       // Internet Explorer 10 이상 지원
  "Chrome >= 30",   // Chrome 30 이상 지원
  "Safari >= 7"     // Safari 7 이상 지원
]
```

📌 이 설정을 추가한 후 다시 npm run build를 실행하자, 벤더 프리픽스가 정상적으로 추가되었다.

---

💡 트러블슈팅 정리

최신 브라우저의 성능이 많이 향상되었기 때문에,
사용자의 연령대, 지역, 기기 환경 등을 고려하여 적절한 browserslist 설정을 적용하는 것이 중요하다.

✅ 앞으로 브라우저 지원 범위를 설정할 때, 프로젝트에 맞게 최적화된 설정을 고민해보자! 🚀🔥

</br>
</br>
</br>

## 2. SVG 업데이트 (캐시 문제)

네트워크 최적화를 위해 **SVG Sprite** 방법을 사용했다.  
하나의 `sprite.svg` 파일 안에 프로젝트에서 사용하는 모든 아이콘을 등록하고  
`<use>` 태그로 필요한 아이콘을 불러오는 방식이다.  
이 방식은 **네트워크 요청을 최소화**하는 장점이 있지만, 다음과 같은 문제가 발생했다.

---

### 문제 상황

처음에는 아래와 같은 방식으로 아이콘을 정상적으로 불러왔다.

```svg
<!-- sprite.svg -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="icon-scroll" viewBox="0 0 12 15">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8L6 0L0 8H2L6 2.66667L10 8H12Z" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 15L6 7L0 15H2L6 9.66667L10 15H12Z" fill="black"/>
  </symbol>
</svg>
```

그리고 HTML에서는 아래와 같이 사용했다.

```html
<svg>
  <use href="/assets/icons/sprite.svg#icon-scroll"></use>
</svg>
```

하지만 `use`로 불러온 아이콘의 색상을 동적으로 변경하고 싶어  
`sprite.svg`의 `fill` 값을 `currentColor`로 수정했다.

```svg
<symbol id="icon-scroll" viewBox="0 0 12 15">
  <path fill="currentColor" ... />
  <path fill="currentColor" ... />
</symbol>
```

그런데 부모 SVG 요소에 `color` 값을 지정해도 아이콘 색상이 변경되지 않는 문제가 발생했다.

---

### 문제 원인

브라우저가 `sprite.svg` 파일을 **정적 리소스**로 인식하여  
**강력하게 캐싱**하고 있었기 때문이다.

`symbol` 요소가 변하지 않는 외부 리소스라고 판단하여,  
`sprite.svg`의 변경 사항을 브라우저가 반영하지 않고  
**이전 데이터를 계속 사용**하고 있었다.

#### 확인했던 사항

- `Cmd + Shift + P`로 강제 새로고침 → 반영 안 됨
- 개발자 도구에서 요소와 스타일 적용 여부 확인 → 반영 안됨
- `localhost:3000/sprite.svg` 경로에서 변경된 내용 확인 → 정상 출력
- 브라우저 캐시 및 인터넷 기록 삭제 → 반영 안 됨

---

### 해결 방법

#### 1. 캐시 무효화 (Query String 방식)

브라우저가 새로 다운로드하도록 하기 위해 `href` 속성에 버전 쿼리를 추가했다.

```html
<svg>
  <use href="/assets/icons/sprite.svg?v=2#icon-scroll"></use>
</svg>
```

✅ 브라우저가 `sprite.svg`를 **다른 리소스로 인식하고 새로 요청**하여 변경된 내용이 반영되었다.

#### 2. 근본적인 이유 파악

- 단순한 디스크 캐시가 아닌 **브라우저의 메모리 캐시 문제**였다.
- 브라우저는 사이트가 열려 있는 동안 `sprite.svg`를 메모리에 유지하며,  
  탭을 닫기 전까지 새로고침이나 캐시 삭제로는 반영되지 않는 경우가 있다.
- 실제로 확인한 것
  - `vite` 개발 서버의 캐시(`.vite` 폴더)를 삭제하고 재시작 → 반영 안 됨
  - 브라우저를 완전히 종료하고 다시 실행 → 변경 사항 반영됨

---

### 정리

#### 🟢 문제 원인

브라우저가 `sprite.svg`를 **정적 파일로 인식하고 캐싱 및 메모리 보관**을 통해  
변경 사항을 반영하지 않았던 것.

#### 🟢 해결 방법

1. `?v=버전` 쿼리를 사용하여 브라우저에 강제 새 요청을 유도
2. 개발 중에는 브라우저 개발자 도구의 `Disable Cache` 옵션을 활성화하고 테스트
3. 배포 시에는 정적 리소스 파일명에 **해시 값(예: sprite.[hash].svg)**을 추가하여 캐시 무효화 전략 적용
4. 브라우저 탭을 닫고 다시 접속

---

### 💡 트러블슈팅 정리

브라우저의 캐시 정책과 메모리 관리 방식을 이해하고,  
정적 리소스를 다룰 때는 캐시 무효화 전략을 반드시 포함시키자!

- 개발 단계 → `Disable Cache` + `?v=버전`
- 운영 배포 → `[hash]` 파일명 전략
- 배포단계에서는 정적 리소스를 변경하는 경우는 적으니 상황에 맞게 하면 좋을거 같다.
  🚀

</br>
</br>
</br>

## 3. this 바인딩 문제 (페이지 전환과 이벤트 핸들러)

페이지 간 전환 기능을 위해 SPA(Single Page Application) 구조로 개발했다.  
이 과정에서 **이벤트 핸들러와 this 바인딩 문제**가 발생하여 디버깅 및 개선을 진행했다.

---

### 문제 상황

페이지 이동 시, 페이지 컴포넌트는 다음과 같이 인스턴스를 새로 생성하여 상태 초기화를 방지하고 있다.

```ts
const PageComponent = findComponent();

if (PageComponent !== this.currentComponent) {
  this.currentComponent = PageComponent;
  this.ComponentInstance = new PageComponent();
}
```

그리고 각 컴포넌트에서는 이벤트 핸들러를 등록하고 있다.

```ts
addEventListeners() {
  return [
    { type: 'click', selector: '.container', handler: updateCounterHandler.bind(this) }
  ];
}
```

📌 여기서 `bind(this)`를 사용하여 핸들러의 `this`를 현재 컴포넌트 인스턴스에 바인딩했다.

하지만 문제는 페이지가 이동될 때마다 새로운 컴포넌트 인스턴스를 생성하고,  
기존 이벤트 핸들러가 브라우저에 남아 있어서 **이전 핸들러가 호출되는 현상**이 발생했다.  
즉, `this`가 다른 인스턴스를 가리켜 예상치 못한 동작을 하게 되었다.

---

### 문제 원인

- 기존 이벤트 핸들러가 브라우저에 등록된 상태로 남아 있음.
- 이벤트 등록 시 `type`과 `selector`만 기준으로 중복 여부를 확인하여  
  `this`가 다른 핸들러는 제거되지 않음.
- `bind(this)`를 통해 새로운 함수를 생성했기 때문에 기존 핸들러와 참조가 다름.
- 결국 이벤트가 중복 등록되거나 의도하지 않은 인스턴스의 핸들러가 호출됨.

---

### 확인 사항

- `App` 컴포넌트는 새로운 페이지로 이동 시 컴포넌트를 새로 생성하여 상태를 초기화하고 있다.
- `this.ComponentInstance`가 새로 생성되었지만, 기존 `eventHolder`에는 이전 인스턴스의 핸들러가 여전히 존재.
- 기존 인스턴스의 이벤트 핸들러가 제거되지 않아 새로운 인스턴스와 충돌.

---

### 문제 코드

```ts
const PageComponent = findComponent();

if (PageComponent !== this.currentComponent) {
  this.currentComponent = PageComponent;
  this.ComponentInstance = new PageComponent();
}
```

---

### 해결 방법

➡ 페이지 전환 시 기존에 등록한 모든 이벤트를 제거하고 `eventHolder`를 초기화했다.

```ts
const PageComponent = findComponent();

if (PageComponent !== this.currentComponent) {
  // 기존 이벤트를 제거
  eventHolder.forEach(({ type, handler }) => {
    this.$root!.removeEventListener(type, handler);
  });

  eventHolder.length = 0;

  this.currentComponent = PageComponent;
  this.ComponentInstance = new PageComponent();
}
```

✅ `eventHolder`에 있는 기존 핸들러를 제거하여  
새로운 컴포넌트 인스턴스의 이벤트 핸들러만 브라우저에 등록되도록 개선했다.

---

### 추가 사항

현재 `counter` 페이지 컴포넌트에서는 상태를 저장할 필요는 없다.  
단순히 증가/감소 기능만 필요하기 때문이다.

하지만 만약 페이지를 벗어났다가 다시 돌아와서  
이전 상태값을 유지하고 싶다면, 상태를 외부에 저장할 필요가 있다.

#### 상태 저장 방법

1. **`localStorage` 사용**

   - 브라우저에 상태를 저장하고 페이지를 다시 로드할 때 불러온다.
   - 예시 코드:

     ```ts
     // 저장
     localStorage.setItem('counter', JSON.stringify(this.state.counter));

     // 복원
     const savedCounter = localStorage.getItem('counter');
     const initialCounter = savedCounter ? JSON.parse(savedCounter) : 0;
     ```

2. **전역 상태 관리**
   - 앱의 공통 상태로 관리하여 페이지가 전환되더라도 값 유지.
   - 예시: Redux, Context API, 또는 직접 만든 글로벌 상태 관리 모듈

---

### 💡 트러블슈팅 정리

SPA에서 페이지 전환 시 이벤트 핸들러와 this 바인딩을 어떻게 관리할지 고민이 필요하다.

✅ `bind(this)` 사용 시, 인스턴스가 새로 생성되면 기존 핸들러와 충돌 가능성을 염두에 둘 것  
✅ 기존 이벤트를 제거하거나 전역 상태를 활용하여 관리 체계를 명확히 할 것  
✅ 개발 중에는 이벤트 핸들링 시스템이 예상대로 동작하는지 디버깅 도구나 로그를 통해 주기적으로 점검할 것

---
