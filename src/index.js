import {Pomodoro} from "./pomodoro.js";

document.addEventListener("DOMContentLoaded", function() {
    const toggleBtnEl = document.querySelector(".toggle-play");
    const breakBtnEl = document.querySelector(".btn-break");
    const timerDisplayEl = document.getElementById("timer-display");

    if(!toggleBtnEl || !timerDisplayEl) {
        throw new Error('Не найдена кнопка запуска таймера');
    }

    const pomodoro = new Pomodoro({
        timerDisplayEl
    });

    toggleBtnEl.addEventListener("click", function(e) {
         if(e.target.classList.contains("active")) {
             pomodoro.pause();
             e.target.classList.remove("active");
             e.target.textContent = 'Начать сессию';
         } else {
             pomodoro.start();
             e.target.classList.add("active");
             e.target.textContent = 'Пауза';
         }
    });

    pomodoro.onEnd(() => {
        if(pomodoro.isBusySession) {
            console.log('Отдых');
            breakBtnEl.style.display = 'inline-flex';
            toggleBtnEl.style.display = 'none';
        } else {
            breakBtnEl.style.display = 'none';
            toggleBtnEl.style.display = 'inline-flex';
            console.log('Пора воркать');
        }
    });
});