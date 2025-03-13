/**
 * es6-string-html 확장프로그램을 사용하기 위하여 만든 템플릿.
 *
 * 기존 템플릿이터널만을 사용해서 동적으로 렌더링하기위한 요소들을 만들때
 * html과 같은 하이라이와 자동완성 기능을 사용하기 위해 필요한 함수이다.
 *  - html``을 통해 들어온 문자열과 ...values 담긴 플레이스홀더의 값들을 reduce를 통해 문자열로 반환한다.
 * @param strings
 * @param values
 * @returns
 */
const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => result + string + (values[i] || ''), '');
};

export { html };
