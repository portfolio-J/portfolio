import { html } from '@/utils/template';
import st from './popup.module.scss';
import Component from '@/common/Component';
import { EventHandler } from '@/common/eventHolder';

type PopupState = {
  isPopupOpen: boolean;
  isMessageVisible: boolean;
  message: string;
};

class Popup extends Component<PopupState> {
  constructor() {
    super({
      isPopupOpen: false,
      isMessageVisible: false,
      message: '',
    });
  }

  render() {
    return html`
      <section class="${st['popup-wrapper']} ${this.state.isPopupOpen ? st.open : ''}">
        <h1 class="${st.title}">Popup</h1>
        <button class="toggle-button">toggle popup</button>
        <p class="${st.message} ${this.state.isMessageVisible ? st.visible : ''}">from popup: ${this.state.message}</p>
        <div class="${st.popup} ${this.state.isPopupOpen ? st.open : ''}">
          <div class="${st['popup-container']}">
            <h3 class="${st['popup-title']}">Hello!</h3>
            <p class="${st['popup-message']}">This is popup message.</p>
            <div class="popup-actions">
              <input type="text" class="popup-input" />
              <button class="popup-ok">OK</button>
              <button class="popup-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private openPopup() {
    this.setState({ isPopupOpen: true });
  }
  private closePopup(state?: Partial<PopupState>) {
    this.setState({ isPopupOpen: false, ...state });
  }

  private handlePopupActions(e: Event) {
    const target = e.target as HTMLElement;
    if (target.matches(`.toggle-button`)) this.openPopup();
    if (!target.closest(`.${st.popup}`)) return;

    if (target.matches(`.popup-cancel`) || target.matches(`.${st.popup}`)) this.closePopup();
    if (target.matches('.popup-ok')) {
      const $input = document.querySelector('.popup-input') as HTMLInputElement;

      this.closePopup({ message: $input.value, isMessageVisible: true });
    }
  }

  private handleConfirmOnEnter(e: KeyboardEvent) {
    if (e.isComposing || e.key !== 'Enter') return;

    const target = e.target as HTMLInputElement;
    const message = target.value;
    this.setState({ isPopupOpen: false, message, isMessageVisible: true });
  }

  protected addEventListeners(): EventHandler[] {
    return [
      { type: 'click', selector: `.${st['popup-wrapper']}`, handler: this.handlePopupActions.bind(this) },
      { type: 'keydown', selector: '.popup-input', handler: this.handleConfirmOnEnter.bind(this) },
    ];
  }
}

export default Popup;
