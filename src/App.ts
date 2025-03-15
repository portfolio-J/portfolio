import type { Route } from './router';
import Component from './common/Component';
import { generateMatchers, findComponent } from './router';
import render from './common/render';
import { eventHolder } from './common/eventHolder';

generateMatchers();

class App extends Component {
  private currentComponent: Route['component'] | null = null;
  private ComponentInstance: Component | null = null;
  private $root = document.getElementById('app');

  render() {
    // 이전의 컴포넌트와 현재의 컴포넌트를 비교후 다르다면 새로운 컴포넌트를 렌더링
    // 같다면 이전의 컴포넌트를 렌더링한다.
    // currentComponent !== PageComponet -> 새롭게 업데이트
    const PageComponent = findComponent();
    if (PageComponent !== this.currentComponent) {
      // 페이지컴포넌트에서 event를 등록할때 this를 바인드하게 된후에
      // new PageComponet로 새로운 페이지 인스턴스를 만들게 되면
      // 이전의 this와 새로운인스턴스의 this가 다르기 때문에 제대로 동작하지 않는문제가 발생한다.(중복된 이벤트는 새로등록되지 않는다.)
      // 새로운 컴포넌트가 등록되면 브라우저에 등록된 이벤트를 제거하고 다시 등록한다.
      eventHolder.forEach(({ type, handler }) => {
        this.$root!.removeEventListener(type, handler);
      });

      eventHolder.length = 0;
      this.currentComponent = PageComponent;
      this.ComponentInstance = new PageComponent();
    }

    const page = this.ComponentInstance!.render();
    return `${page}`;
  }
}
/**
 * a링크를 클릭시 서버로 html을 재요청하는 것을 막기위해서 이벤트 동작을 막는다.
 * pushState를 사용해 히스토리를 관리하고 리다이렉트를 방지한다.
 * url이 변경된이후에 render()함수를 호출해 해당되는 페이지를 리렌더링한다
 */
window.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.route')) return;

  e.preventDefault();

  const path = target.dataset.route;
  if (location.pathname === path) return;
  history.pushState(null, '', path);

  render();
});

/**
 * 뒤로가기나 앞으로가기 클릭시 리렌더링한다
 * pushState를 사용하였기 때문에 새로운 히스토리 목록을 통해 관리하므로
 * popstate를 사용하지 않으면 뒤로가기와 앞으로가기를 통해 리렌더링을 할수 없다.
 */
window.addEventListener('popstate', () => {
  render();
});

export default App;
