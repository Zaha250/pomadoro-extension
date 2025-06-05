import {Pomodoro} from "./pomodoro.js";

document.addEventListener("DOMContentLoaded", function() {
    const toggleBtnEl = document.querySelector(".toggle-play");
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
             e.target.textContent = 'Play';
         } else {
             pomodoro.start();
             e.target.classList.add("active");
             e.target.textContent = 'Pause';
         }
    });


    pomodoro.onEnd(() => {
        alert('ENG');
    });
});