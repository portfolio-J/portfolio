import Component from '../../common/Component';
import { routes } from '../../router';
class Home extends Component {
  render() {
    return `
   <div>
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
