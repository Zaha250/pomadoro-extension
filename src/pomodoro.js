import {Timer} from "./timer.js";
import {formatTime} from "./utils/date.js";

const DEFAULT_SESSION_TIME = (1000 * 7) * 1; // 25 min
const DEFAULT_BREAK_TIME = (1000 * 5) * 1; // 5 min

export class Pomodoro {
    constructor({timerDisplayEl}) {
        this.timer = new Timer(DEFAULT_SESSION_TIME);
        this.timerBreak = new Timer(DEFAULT_BREAK_TIME);
        this.timerDisplayEl = timerDisplayEl;

        this.timerDisplayEl.textContent = formatTime(this.timer.startTime);
        this.isBusySession = false;
    }

    /** Запуск цикла */
    start() {
        this.isBusySession = true;
        this.timer.start();

        this.timer.onUpdate((remainingTime) => {
            this.timerDisplayEl.textContent = formatTime(remainingTime);
        });
    }

    /** Запуск перерыва */
    startBreak() {
        this.timerBreak.start();

        this.timer.onUpdate((remainingTime) => {
            this.timerDisplayEl.textContent = formatTime(remainingTime);
        });
    }

    stop() {
        this.timer.stop();
        this.timerDisplayEl.textContent = formatTime(this.timer.startTime);
        this.isBusySession = false;
    }

    pause() {
        this.timer.pause();
    }

    onEnd(cb) {
        this.isBusySession = !this.isBusySession;
        this.timer.onEnd(cb);
    }

    /**
     * Событие окончания рабочей сессии
     * */
    onEndSession(cb) {
        this.isBusySession = false;
        this.timer.onEnd(cb);
    }

    /**
     * Событие окончания перерыва
     * */

    onEndBreak(cb) {
        this.timer.onEnd(cb);
    }
}