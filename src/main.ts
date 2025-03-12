import './style.scss';
import render from './common/render.ts';
import App from './App.ts';
render(App, document.querySelector<HTMLDivElement>('#app')!);
