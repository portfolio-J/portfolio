import { Home, Palindrome, Scroll, Counter } from './pages';
import Component from './common/Component.ts';
import NotFound from './pages/NotFound.ts';

type Route = {
  path: string;
  component: new (...arg: any[]) => Component;
  matcher?: RegExp;
};

let _routes: Route[];

const routes: Route[] = [
  { path: '/', component: Home },
  { path: '/counter', component: Counter },
  { path: '/scroll', component: Scroll },
  { path: '/palindrome', component: Palindrome },
];

/**
 * 정규표현식을 사용하여 location.pathname과 매핑하는 route.path를 갖는 객체를 찾기위하여 사용한다.
 * 네이밍 캡쳐그룹을 만들어 라우트 파라미터와 비교하여 찾는다.
 *
 * @example
 * 1./counter => /^\/counter/$/
 * 2./post/:id => /^\/post/(?<id>[^\\/]+)$/
 * 3./post/:id/book/:id => /^\/post/(?<id>[^\\/]+)$\/book\/(?<id>[^\\/]+)$/
 *
 */
const generateMatchers = () => {
  _routes = routes.map(route => {
    const matcher = new RegExp(
      `^${route.path.replace(/:(\w+)/g, (_, paramName) => {
        return `(?<${paramName}>[^\\/]+)`;
      })}$`,
    );
    return { ...route, matcher };
  });
};

const findComponent = (): Route['component'] => {
  return _routes.find(({ matcher }) => matcher?.test(location.pathname))?.component ?? NotFound;
};

export type { Route };
export { findComponent, generateMatchers, routes };
