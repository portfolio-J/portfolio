import Component from '../../common/Component';
import { html } from '../../utils/template';

class Scroll extends Component {
  render() {
    return html`
      <section>
        <div>
          <ul>
            <li></li>
            <li class="i">2</li>
            <li class="i">3</li>
            <li class="i">4</li>
            <li class="i">5</li>
          </ul>
        </div>
      </section>
    `;
  }
}

export default Scroll;
