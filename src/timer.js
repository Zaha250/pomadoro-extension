export class Timer {
    constructor(startTime = 0) {
        this.startTime = startTime; // Общее время таймера в миллисекундах
        this.remainingTime = startTime; // Оставшееся время
        this.timerId = null; // ID таймера
        this.animationFrameId = null;
        this.startTimestamp = 0; // Время начала отсчета
        this.isRunning = false; // Флаг работы таймера
        this.isPaused = false;
        this.pauseTime = 0; // Время, когда был поставлен на паузу
        this.updateCallbacks = [];
        this.endCallbacks = [];
    }

    start() {
        if (this.isRunning || this.remainingTime <= 0) return;

        // Если был на паузе - возобновляем
        if (this.isPaused) {
            this.resume();
            return;
        }

        this.isRunning = true;
        this.startTimestamp = Date.now();

        const update = () => {
            const elapsed = Date.now() - this.startTimestamp;
            this.remainingTime = Math.max(0, this.startTime - elapsed);

            // Оповещаем подписчиков об обновлении
            this.dispatchUpdate(this.remainingTime);

            if (this.remainingTime > 0) {
                this.animationFrameId = requestAnimationFrame(update);
            } else {
                this.stop();
            }
        };

        update();
    }

    pause() {
        if (!this.isRunning) return;

        cancelAnimationFrame(this.animationFrameId);
        this.pauseTime = Date.now();
        this.isRunning = false;
        this.isPaused = true;
    }

    stop() {
        if (!this.isRunning && this.remainingTime === this.startTime) return;

        clearTimeout(this.timerId);
        this.remainingTime = 0;
        this.isRunning = false;
        this.dispatchTimerEnd();
    }

    /**
     * Внутренний метод для возобновления с паузы
     */
    resume() {
        const pausedDuration = Date.now() - this.pauseTime;
        this.startTimestamp += pausedDuration; // Корректируем время старта

        this.isRunning = true;
        this.isPaused = false;

        const update = () => {
            const elapsed = Date.now() - this.startTimestamp;
            this.remainingTime = Math.max(0, this.startTime - elapsed);

            this.dispatchUpdate(this.remainingTime);

            if (this.remainingTime > 0) {
                this.animationFrameId = requestAnimationFrame(update);
            } else {
                this.stop();
            }
        };

        update();
    }

    /**
     * Регистрирует callback на завершение таймера
     * @param {function} callback - Функция, вызываемая при завершении
     * @returns {function} Функция для отмены подписки
     * @public
     */
    onEnd(callback) {
        this.endCallbacks.push(callback);
        return () => {
            this.endCallbacks = this.endCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Вызывает все зарегистрированные callbacks при завершении таймера
     * @private
     * @returns {void}
     */
    dispatchTimerEnd() {
        this.endCallbacks.forEach(callback => {
            try {
                callback();
            } catch (e) {
                console.error('Timer callback error:', e);
            }
        });
        this.endCallbacks = [];
    }

    reset() {
        this.stop();
        this.remainingTime = this.startTime;
    }

    /**
     * Подписка на обновления таймера
     * @param {function(number): void} callback - Получает оставшееся время в ms
     * @returns {function} Функция для отмены подписки
     */
    onUpdate(callback) {
        this.updateCallbacks.push(callback);
        return () => {
            this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Вызывает все колбэки обновления
     * @private
     * @param {number} remainingTime - Оставшееся время в ms
     */
    dispatchUpdate(remainingTime) {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(remainingTime);
            } catch (e) {
                console.error('Timer update callback error:', e);
            }
        });
    }

    /**
     * Возвращает оставшееся время таймера в миллисекундах
     * @returns {number} Оставшееся время в ms
     * @public
     */
    getTimeLeft() {
        if (!this.isRunning) return this.remainingTime;

        const elapsed = Date.now() - this.startTimestamp;
        return Math.max(0, this.remainingTime - elapsed);
    }
}