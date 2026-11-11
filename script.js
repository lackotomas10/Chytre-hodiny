"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const clock = document.getElementById("čas");
    const date = document.querySelector("#HodinyDiv h3");

    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString("cs-CZ", {
            hour: "2-digit",
            minute: "2-digit"
        });
        date.textContent = now.toLocaleDateString("cs-CZ", {
            weekday: "long",
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const rest = seconds % 60;
        const pad = (number) => String(number).padStart(2, "0");

        return hours > 0
            ? `${pad(hours)}:${pad(minutes)}:${pad(rest)}`
            : `${pad(minutes)}:${pad(rest)}`;
    }

    updateClock();
    window.setInterval(updateClock, 1000);

    const menuItems = document.querySelectorAll("#InvisiDiv p");
    const panels = document.querySelectorAll(".tool-panel");

    function activatePanel(item) {
        const panel = document.getElementById(item.dataset.panel);
        const shouldOpen = panel.hidden;
        panels.forEach((current) => {
            current.hidden = true;
        });
        menuItems.forEach((menuItem) => menuItem.setAttribute("aria-expanded", "false"));
        panel.hidden = !shouldOpen;
        item.setAttribute("aria-expanded", String(shouldOpen));
    }

    menuItems.forEach((item) => {
        item.addEventListener("click", () => activatePanel(item));
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activatePanel(item);
            }
        });
    });

    const timerMinutes = document.getElementById("timer-minutes");
    const timerSeconds = document.getElementById("timer-seconds");
    const timerDisplay = document.getElementById("timer-display");
    const timerStatus = document.getElementById("timer-status");
    const timerSettings = document.getElementById("timer-settings");
    const timerFace = document.getElementById("timer-face");
    let timerInterval = null;
    let timerLeft = 0;
    let timerEndsAt = 0;
    let timerStarted = false;

    function showTimerInput() {
        timerDisplay.textContent = formatTime(
            Number(timerMinutes.value) * 60 + Number(timerSeconds.value)
        );
    }

    function stopTimer() {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }

    function toggleTimer() {
        if (timerInterval !== null) {
            timerLeft = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
            stopTimer();
            timerDisplay.textContent = formatTime(timerLeft);
            return;
        }

        if (timerStarted && timerLeft === 0) {
            return;
        }
        if (!timerStarted) {
            const minutes = Number(timerMinutes.value);
            const seconds = Number(timerSeconds.value);
            if (!Number.isInteger(minutes) || !Number.isInteger(seconds)
                || minutes < 0 || minutes > 5999 || seconds < 0 || seconds > 59
                || minutes * 60 + seconds === 0) {
                timerStatus.textContent = "Zadej platný čas delší než nula.";
                return;
            }
            timerLeft = minutes * 60 + seconds;
            timerSettings.hidden = true;
            timerStarted = true;
        }

        timerEndsAt = Date.now() + timerLeft * 1000;
        timerInterval = window.setInterval(() => {
            timerLeft = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
            timerDisplay.textContent = formatTime(timerLeft);
            if (timerLeft === 0) {
                stopTimer();
                timerStatus.textContent = "Čas vypršel.";
            }
        }, 100);
    }

    timerFace.addEventListener("click", toggleTimer);
    timerFace.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTimer();
        }
    });
    [timerMinutes, timerSeconds].forEach((input) => {
        input.addEventListener("input", () => {
            if (!timerStarted) {
                showTimerInput();
            }
        });
    });

    document.querySelectorAll(".number-arrow").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.input);
            const step = Number(button.dataset.step);
            const min = Number(input.min);
            const max = Number(input.max);
            const value = Number(input.value) || 0;
            input.value = String(Math.min(max, Math.max(min, value + step)));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });

    document.getElementById("timer-end").addEventListener("click", () => {
        stopTimer();
        timerStarted = false;
        timerLeft = 0;
        timerSettings.hidden = false;
        showTimerInput();
        timerStatus.textContent = "";
        document.getElementById("timer-panel").hidden = true;
        menuItems[0].setAttribute("aria-expanded", "false");
    });

    const stopwatchDisplay = document.getElementById("stopwatch-display");
    const stopwatchFace = document.getElementById("stopwatch-face");
    let stopwatchInterval = null;
    let stopwatchElapsed = 0;
    let stopwatchStartedAt = 0;

    function showStopwatch() {
        const elapsed = stopwatchElapsed + (stopwatchInterval === null
            ? 0
            : Date.now() - stopwatchStartedAt);
        stopwatchDisplay.textContent = formatTime(Math.floor(elapsed / 1000));
    }

    function toggleStopwatch() {
        if (stopwatchInterval !== null) {
            stopwatchElapsed += Date.now() - stopwatchStartedAt;
            window.clearInterval(stopwatchInterval);
            stopwatchInterval = null;
            showStopwatch();
            return;
        }

        stopwatchStartedAt = Date.now();
        stopwatchInterval = window.setInterval(showStopwatch, 100);
    }

    stopwatchFace.addEventListener("click", toggleStopwatch);
    stopwatchFace.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleStopwatch();
        }
    });

    document.getElementById("stopwatch-end").addEventListener("click", () => {
        window.clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        stopwatchElapsed = 0;
        showStopwatch();
        document.getElementById("stopwatch-panel").hidden = true;
        menuItems[1].setAttribute("aria-expanded", "false");
    });
});
