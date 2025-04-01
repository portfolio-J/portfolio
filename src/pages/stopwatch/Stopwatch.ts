import Component from '@/common/Component';
import st from './stopwatch.module.scss';
import { html } from '@/utils/template';

type StopWatchState = {
  time: number;
  buttons: {
    left: 'Start' | 'Stop';
    right: 'Lap' | 'Reset';
  };
  laps: string[];
};

class StopWatch extends Component<StopWatchState> {
  private timeId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super(
      {
        time: 0,
        buttons: {
          left: 'Start',
          right: 'Reset',
        },
        laps: [],
      },
      () => {
        clearInterval(this.timeId!);
      },
    );
  }

  render() {
    const isDisabled = this.state.time === 0;

    return html`
      <section class="${st['stopwatch-wrapper']}">
        <h1 class="${st.title}">Stop Watch</h1>
        <div class="${st['stopwatch-container']}">
          <span>${this.formatTime(this.state.time)}</span>
          <div class="${st['stopwatch-btns']}">
            <button class="${st['stopwatch-btn']}">${this.state.buttons.left}</button>
            <button class="${st['stopwatch-btn']}" ${isDisabled ? 'disabled' : ''}>${this.state.buttons.right}</button>
          </div>
        </div>
        <div class="${st.laps} ${this.state.laps.length ? st['laps-active'] : ''}">
          <div class="${st['lap-title']}">Laps</div>
          <div class="${st['lap-title']}">Time</div>
          ${this.state.laps
            .map((lap, idx) => {
              return html`<div>${idx + 1}</div>
                <div>${lap}</div>`;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  startTimer() {
    this.timeId = setInterval(() => {
      this.setState({
        time: this.state.time + 100,
        buttons: { left: 'Stop', right: 'Lap' },
      });
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timeId!);
    this.setState({
      buttons: { left: 'Start', right: 'Reset' },
    });
  }

  resetTimer() {
    clearInterval(this.timeId!);
    this.setState({
      time: 0,
      buttons: {
        left: 'Start',
        right: 'Reset',
      },
      laps: [],
    });
  }

  recordLap() {
    const time = this.formatTime(this.state.time);

    this.setState({
      laps: [...this.state.laps, time],
    });
  }

  // formatTime(time: number) {
  //   const minute = Math.floor(time / 60000) > 9 ? Math.floor(time / 60000) : `0${Math.floor(time / 60000)}`;
  //   const second =
  //     Math.floor((time % 60000) / 1000) > 9
  //       ? Math.floor((time % 60000) / 1000)
  //       : `0${Math.floor((time % 60000) / 1000)}`;
  //   const millisecond =
  //     Math.floor((time % 1000) / 10) > 9 ? Math.floor((time % 1000) / 10) : `0${Math.floor((time % 1000) / 10)}`;

  //   return `${minute}:${second}:${millisecond}`;
  // }

  formatTime(time: number): string {
    const pad = (num: number): string => String(num).padStart(2, '0');

    const minute = Math.floor(time / 60000);
    const second = Math.floor((time % 60000) / 1000);
    const millisecond = Math.floor((time % 1000) / 10);

    return `${pad(minute)}:${pad(second)}:${pad(millisecond)}`;
  }

  handleStopWatch(e: Event) {
    const target = e.target as HTMLButtonElement;

    switch (target.textContent) {
      case 'Start':
        this.startTimer();
        break;
      case 'Stop':
        this.stopTimer();
        break;
      case 'Reset':
        this.resetTimer();
        break;
      case 'Lap':
        this.recordLap();
        break;
      default:
        break;
    }
  }

  addEventListeners() {
    return [{ type: 'click', selector: `.${st['stopwatch-btn']}`, handler: this.handleStopWatch.bind(this) }];
  }
}

export default StopWatch;
