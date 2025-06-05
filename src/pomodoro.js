import {Timer} from "./timer.js";
import {formatTime} from "./utils/date.js";

const DEFAULT_TIME = (1000 * 5) * 1; // 25 min

export class Pomodoro {
    constructor({timerDisplayEl}) {
        this.timer = new Timer(DEFAULT_TIME);
        this.timerDisplayEl = timerDisplayEl;

        this.timerDisplayEl.textContent = formatTime(this.timer.startTime);
    }

    /** Запуск цикла */
    start() {
        this.timer.start();

        this.timer.onUpdate((remainingTime) => {
            this.timerDisplayEl.textContent = formatTime(remainingTime);
        });
    }

    stop() {
        this.timer.stop();
        this.timerDisplayEl.textContent = formatTime(this.timer.startTime);
    }

    pause() {
        this.timer.pause();
    }

    onEnd(cb) {
        this.timer.onEnd(cb);
    }
}