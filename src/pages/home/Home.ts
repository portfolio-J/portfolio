import Component from '../../common/Component';
import { routes } from '../../router';
class Home extends Component {
  render() {
    return `
   <div>
    <h1>이곳은 홈입니다.</h1>
    <ul class="route">${routes
      .map(({ path, component }) => {
        if (path === '/') return;
        return `<li><a href=${path} alt=${component.name} data-route=${path}>${component.name}</a></li>`;
      })
      .join('')}</ul>
   </div>
  `;
  }
}

export default Home;
