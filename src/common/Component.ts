import type { EventHandler } from './eventHolder';
import { eventHolder } from './eventHolder';
import render from './render';

/**
 * 모든 페이지컴포넌트의 상태와 이벤트핸들러를 처리해주는 추상클래스
 */
abstract class Component<S extends Record<string, any> = {}> {
  protected state: S;
  /**
   *
   * @param initalState : 초기 상태값 존재하지 않을 수도 있다.
   */
  constructor(initalState?: S) {
    this.state = { ...initalState } as S;
    this.holdEvents();
  }

  protected addEventListeners?(): EventHandler[];

  /**
   * 자식 클래스에서 호출시 객체로 상태를 저장하여 인자를 넘겨준다.
   * 받은 상태를 기존의 상태에 덮어씌운다.
   * 그리고 리렌더링을 한다.
   *
   * @param newState 상태로 이루어진 객체
   */
  private setState(newState: Partial<S>) {
    this.state = { ...this.state, ...newState };
    render();
  }

  /**
   * 페이지 컴포넌트의 인스턴스가 만들어질떄 생성자가 실행한다.
   * 페이지컴포넌트에 등록된 addEvenetListene를 호출하여
   * {type,selector,handler}로 이루어진 배열을 반환한다.
   * 이벤트가 존재할시에는 eventHolder 배열에 push하고
   * 렌더링이 발생할때 selector에 해당되는 요소에 이벤트를 바인딩한다.
   * 추가로 이벤트 위임을 위해 closest,matches로 조건을 확인한다.
   */
  private holdEvents() {
    const events = this.addEventListeners?.();
    if (!events) return;

    for (const event of events) {
      if (event.selector === 'window' || event.selector === null) {
        eventHolder.push(event);
        continue;
      }

      let isDuplicate = eventHolder.find(({ type, selector }) => type === event.type && event.selector === selector);
      if (!isDuplicate) {
        const { handler, selector } = event;
        event.handler = (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.matches(selector) || target.closest(selector)) handler(e);
          eventHolder.push(event);
        };
      }
    }
  }

  abstract render(): string | Promise<string>;
}

export default Component;
