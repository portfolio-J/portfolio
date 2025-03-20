## DarkMode

### 기능 구현

1. `localStorage`의 `isDarkMode` 값을 저장하고 해당 값을 불러와 다크모드를 적용한다.
2. 만약 `localStorage`에 `isDarkMode`가 없다면(`null`), 사용자의 OS 테마를 불러와 그에 맞게 적용한다.
3. 토글 버튼을 클릭하여 다크모드를 on/off 한다.

---

### 구현 코드

```typescript
// 사용자 시스템의 다크모드 유무를 확인하는 함수
function getSystemDarkModePreference(): boolean {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkMode;
}

// 로컬스토리지나 시스템에 저장된 다크모드 유무를 판단하는 함수
function getDarkModePreference(): boolean {
  const localStorageValue = localStorage.getItem('isDarkMode');

  // 값이 있으면 JSON.parse, 없으면 시스템 다크모드 값을 가져옴
  const isDarkMode = localStorageValue !== null ? JSON.parse(localStorageValue) : getSystemDarkModePreference();

  // 동기화 - 현재 값을 로컬스토리지에 저장
  localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));

  return isDarkMode;
}
```

`getDarkModePreference` 함수를 호출하면 브라우저의 `localStorage`에 `isDarkMode` 값이 존재하는 경우 해당 `boolean` 값을 반환한다.  
만약 존재하지 않는 경우에는 `getSystemDarkModePreference()`를 호출하여 사용자의 OS 테마를 기준으로 다크모드를 적용한다.  
그리고 `isDarkMode` 값을 반환하고, 해당 값을 `localStorage`에 동기화하여 저장한다.

---

### 다크모드 토글 함수

```typescript
private toggleDarkMode() {
  const currentIsDarkMode = !this.state.isDarkMode;

  // 상태 반전 후 로컬스토리지 업데이트
  localStorage.setItem('isDarkMode', JSON.stringify(currentIsDarkMode));

  // 상태를 업데이트하여 리렌더링
  this.setState({ isDarkMode: currentIsDarkMode });
}
```

토글 버튼을 클릭하면 `toggleDarkMode()` 함수를 호출하여 `isDarkMode` 상태를 반전시킨다.  
그리고 `localStorage`에 반영하고, 상태를 업데이트하여 리렌더링을 유도한다.

---

### 추가 사항

- `localStorage`는 `키(key)`와 `값(value)`으로 데이터를 저장한다.
- `값(value)`은 반드시 **문자열(string)**이어야 하므로 데이터를 저장할 때 `JSON.stringify()`를 사용한다.
- 데이터를 불러올 때는 `JSON.parse()`를 사용하여 원래 데이터 타입으로 변환해준다.

#### 예시

```typescript
// 저장할 때
localStorage.setItem('isDarkMode', JSON.stringify(true));

// 불러올 때
const darkMode = JSON.parse(localStorage.getItem('isDarkMode') ?? 'false');
```

#### 정리

- `JSON.stringify()` : 데이터를 문자열로 변환하여 저장한다.
- `JSON.parse()` : 문자열을 원래 데이터 형태로 변환하여 사용한다.
- `localStorage.getItem()`이 `null`을 반환할 경우를 대비하여 `??` 연산자를 사용해 기본값을 설정하는 것이 안전하다.

---

### 개선 아이디어

1. **유틸 함수로 묶어서 재사용 가능하게 만들기**

```typescript
// utils/preferences.ts
export function savePreference(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getPreference<T>(key: string, fallback: T): T {
  const storedValue = localStorage.getItem(key);
  return storedValue !== null ? JSON.parse(storedValue) : fallback;
}
```

2. **다크모드 함수 개선 예시**

```typescript
import { savePreference, getPreference } from '@/utils/preferences';

function getDarkModePreference(): boolean {
  const isDarkMode = getPreference<boolean>('isDarkMode', getSystemDarkModePreference());
  savePreference('isDarkMode', isDarkMode);
  return isDarkMode;
}
```

---

## 최종 정리

| 기능                 | 설명                                                 |
| -------------------- | ---------------------------------------------------- |
| 시스템 다크모드 확인 | `window.matchMedia('(prefers-color-scheme: dark)')`  |
| 로컬스토리지 값 확인 | `localStorage.getItem('isDarkMode')`                 |
| 상태 저장 및 동기화  | `JSON.stringify`와 `JSON.parse`로 값 직렬화/역직렬화 |
| 상태 토글 및 반영    | `this.setState()`로 상태 변경 후 리렌더링            |
