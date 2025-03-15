import App from '../App';
import applyDiff from './applyDiff';
import { eventHolder } from './eventHolder';

let $root: HTMLElement | null = null;
let rootComponentInstance: App | null = null;

/**
 * render로 불러온 이벤트들을 root나 window에 바인딩하는 함수
 * @param $root
 */
const bindEventHandler = ($root: HTMLElement) => {
  for (const { type, selector, handler } of eventHolder) {
    (selector === 'window' ? window : $root).addEventListener(type, handler);
  }
};

/**
 * 컴포넌트의 렌더링/리렌더링 하기위해 존재하는 함수
 *
 * @param RootComponent defulat가 되는 클래스 여기서는 APP이 된다
 * @param $container 모든 렌더링요소를 묶기 위해 존재하는 root컨테이너 html에 존재하는 div
 *
 * 이전의 node와 현재의 node를 비교해 변경된 요소만 리렌더링한다.
 */
const render = async (RootComponent?: typeof App, $container?: HTMLDivElement) => {
  /**
   * 리렌더링할시에 비교하기위해 root와 rootComponentInstance를 할당한다.
   */
  if (!$root && $container) $root = $container;
  if (!rootComponentInstance && RootComponent) rootComponentInstance = new RootComponent();
  if (!$root || !rootComponentInstance) throw new Error('초기화 되지 않은 상태에서 렌더링');

  /**
   * cloneNode를 사용하지 않고 직접적으로 root를 조작하면 root에 바인딩되는 모든 이벤트가 삭제되기 때문에 클론을 만든다.
   * 그후 pageComponent의 요소들을 virtual Dom에 innerHTML한다.
   * applyDiff를 통해 요소들을 비교하고 업데이트한다.
   */
  const $virtual = $root.cloneNode() as HTMLElement;
  const domString = await rootComponentInstance.render();
  $virtual.innerHTML = domString;

  applyDiff($root, $virtual);

  bindEventHandler($root);
};

export default render;
