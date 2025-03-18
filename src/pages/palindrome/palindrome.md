## Palindrome 프로젝트

### 기능 구현

간단한 Palindrome 판별 프로젝트를 제작하며 다음과 같은 기능을 구현했다.

1. 문자열을 뒤집어도 앞뒤가 같다면 그것은 `palindrome`이다.
2. 소문자와 대문자를 구별하지 않고, 특수문자와 공백을 무시한다.
3. 맞으면 `is a palindrome`을 출력하고, 틀리면 `is a not palindrome`을 출력한다.

---

### 구현 코드

#### Palindrome 판별 함수

```ts
isPalindrome(str: string): boolean {
  const normalizedStr = str.toLowerCase().replace(/[\w_\s]/g, '');
  const reverse = normalizedStr.split('').reverse().join('');

  return normalizedStr === reverse;
}
```

➡️ 현재 입력한 문자가 `palindrome`인지 확인하고, 맞다면 `true`를 반환한다.  
➡️ 문자열의 길이가 짧기 때문에 최적화를 신경쓰지 않고 내장 메서드 3개(`split`, `reverse`, `join`)를 사용했다.  
➡️ 만약 문자열의 길이가 크다면, 다음과 같은 방법으로 최적화를 할 수 있다.

---

#### 최적화 방법 (양 끝 비교)

```ts
const len = normalizedStr.length;

for (let i = 0; i < len / 2; i++) {
  if (normalizedStr[i] !== normalizedStr[len - 1 - i]) {
    return false;
  }
}

return true;
```

➡️ 문자열의 양쪽 끝을 비교하여 하나라도 다르면 `false`를 반환한다.  
➡️ 중간에 다르면 바로 종료할 수 있어 효율적이다.

---

#### Submit 이벤트 핸들러

```ts
handleSubmit(e: Event): void {
  e.preventDefault();

  const target = e.target as HTMLFormElement;
  const value = (target.querySelector(`.${st.input}`) as HTMLInputElement).value;
  const isPalindrom = this.isPalindrome(value);

  this.setState({ isPalindrom: isPalindrom, value });
}
```

➡️ `form`의 `submit` 이벤트에 바인딩하고, `submit` 핸들러가 호출되면 동작하는 코드다.  
➡️ `e.target`이 `form` 요소이기 때문에 `HTMLFormElement`로 타입을 선언하고,  
➡️ `value`는 `form`의 자식 요소인 `input`에서 가져오므로 `HTMLInputElement` 타입을 선언했다.

---

#### 렌더링 코드

```html
<form class="${st.submit}">
  <input class="${st.input}" type="text" placeholder="Enter a word to check" />
  <button class="${st.button}">Check</button>
</form>
<span class="${st.result} ${this.state.value !== '' ? '' : st.hidden}">
  "${this.state.value}" is a ${this.state.isPalindrom ? '' : 'not'} palindrome
</span>
```

➡️ 입력한 값이 `palindrome`이 아닐 경우 `"not"`이 추가되도록 조건문을 작성했다.  
➡️ `this.state.value`가 비어있다면 `st.hidden` 클래스를 추가하여 `결과 텍스트`를 숨긴다.

---

### 추가 사항

#### 상태 값 보호 개선

이전에는 `this.setState({ value })`를 호출해 상태를 업데이트했지만,  
`this.state.value = value`와 같은 직접 접근을 통해 상태를 수정할 수 있는 문제가 있었다.

#### 개선 방법

상속받은 `Component` 클래스의 `state`를 `private`하게 만들고,  
`getter`를 사용해 **읽기 전용(ReadOnly)**으로 노출하여 자식 클래스에서 상태를 수정할 수 없도록 변경했다.

```ts
get state(): Readonly<S> {
  return this._state;
}
```

➡️ 반환 타입에 `Readonly<S>`를 적용한 이유는 `state`가 객체 타입이기 때문이다.  
➡️ 만약 `private`만 추가하면 객체 안의 값들은 여전히 수정이 가능하다.  
➡️ `Readonly<S>`를 사용하여 객체 내부 값들도 `freeze`된 것처럼 읽기 전용으로 만들어 안전성을 높였다.

---

### 트러블슈팅 정리

✅ `palindrome` 판별은 문자열 길이에 따라 적절한 알고리즘을 선택하여 효율성을 고려한다.  
✅ `Component`의 상태(`state`)는 `private`와 `Readonly`를 통해 안전하게 관리하며, 자식 클래스의 직접 수정은 막는다.  
✅ `form`과 `input` 요소에 적절한 타입을 선언하여 타입 안정성을 높였다.  
✅ `CSS Modules`를 활용하여 스타일 충돌을 방지하고 클래스명을 안전하게 관리한다.
