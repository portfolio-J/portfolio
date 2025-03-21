## Popup 프로젝트

### 기능 구현

간단한 팝업 프로젝트를 제작하며 다음과 같은 기능을 구현했다.

1. `toggle button`을 클릭 시 팝업창을 오픈한다.
2. 팝업창이 열린 상태에서 `cancel` 버튼을 클릭하거나 팝업 컨테이너 외부를 클릭 시 팝업창을 닫는다.
3. 팝업창이 열린 상태에서 `ok` 버튼을 클릭하거나 `Enter` 키를 누르면 입력된 값을 업데이트하고 팝업창을 닫는다.
4. 입력값은 메인 메시지에 반영되고, 메시지가 보이도록 한다.

---

### 상태 정의 (State)

```ts
type PopupState = {
  isPopupOpen: boolean;
  isMessageVisible: boolean;
  message: string;
};
```

➡️ `Popup` 컴포넌트는 위 상태를 기준으로 렌더링과 동작을 관리한다.

| 상태               | 설명                                           |
| ------------------ | ---------------------------------------------- |
| `isPopupOpen`      | 팝업창이 열려 있는지 여부를 나타낸다.          |
| `isMessageVisible` | 메시지가 화면에 보이는지 여부를 제어한다.      |
| `message`          | 입력된 값을 상태로 저장하여 메시지로 출력한다. |

---

### 구현 코드

#### 클릭 이벤트 핸들러

```ts
private handlePopupActions(e: Event) {
  const target = e.target as HTMLElement;

  if (target.matches(`.toggle-button`)) {
    this.openPopup();
    return;
  }

  if (!target.closest(`.${st.popup}`)) return;

  if (target.matches(`.popup-cancel`) || target.matches(`.${st.popup}`)) {
    this.closePopup();
  }

  if (target.matches('.popup-ok')) {
    const $input = document.querySelector('.popup-input') as HTMLInputElement;
    this.closePopup({ message: $input.value, isMessageVisible: true });
  }
}
```

➡️ 클릭 이벤트를 `popup-wrapper` 요소에 위임하여 이벤트 처리를 담당한다.

#### 클릭 핸들러 설명

1. `toggle button` 클릭 시 팝업창을 오픈한다.
2. 팝업창이 열린 상태에서 `cancel` 버튼을 클릭하거나 팝업 외부(`popup` 영역)를 클릭 시 팝업창을 닫는다.
3. `ok` 버튼을 클릭하면 `input`에 입력된 값을 `message`로 업데이트하고 팝업창을 닫는다.

---

#### 키보드 이벤트 핸들러

```ts
private handleConfirmOnEnter(e: KeyboardEvent) {
  if (e.isComposing || e.key !== 'Enter') return;

  const target = e.target as HTMLInputElement;
  const message = target.value;
  this.setState({ isPopupOpen: false, message, isMessageVisible: true });
}
```

➡️ `Enter` 키를 눌렀을 때 동작하는 핸들러이다.

#### 키보드 핸들러 설명

1. `e.isComposing`을 통해 조합 중인 문자 입력(한글 입력 등) 여부를 확인하고, 조합 중일 경우에는 무시한다.
2. `Enter` 키가 아니면 반환한다.
3. `Enter` 키가 눌렸을 경우 입력값을 `message`로 업데이트하고 팝업창을 닫는다.

---

### 추가 사항

#### `localStorage`와 상태 저장

➡️ 추후 팝업 메시지를 `localStorage`에 저장하여 새로고침 시에도 유지될 수 있도록 확장 가능하다.

```ts
localStorage.setItem('popupMessage', JSON.stringify(this.state.message));
```

#### 이벤트 핸들링 개선

➡️ 이벤트 위임을 통해 클릭 이벤트를 효율적으로 관리하고, 핸들러 내부에서 명확한 역할을 분리했다.  
➡️ `keydown` 이벤트에서도 `isComposing`과 `e.key` 조건문을 통해 안정적인 입력 처리를 구현했다.

---

### 최종 렌더링 코드 예시

```ts
render() {
  return html`
    <section class="${st['popup-wrapper']} ${this.state.isPopupOpen ? st.open : ''}">
      <h1 class="${st.title}">Popup</h1>
      <button class="toggle-button">toggle popup</button>
      <p class="${st.message} ${this.state.isMessageVisible ? st.visible : ''}">
        from popup: ${this.state.message}
      </p>
      <div class="${st.popup} ${this.state.isPopupOpen ? st.open : ''}">
        <div class="${st['popup-container']}">
          <h3 class="${st['popup-title']}">Hello!</h3>
          <p class="${st['popup-message']}">This is popup message.</p>
          <div class="popup-actions">
            <input type="text" class="popup-input" />
            <button class="popup-ok">OK</button>
            <button class="popup-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </section>
  `;
}
```

---
