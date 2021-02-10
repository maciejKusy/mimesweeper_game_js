export class Timer {
    constructor() {
        this.timeElapsed = 0;
        this.minutes = document.getElementById("minutes");
        this.seconds = document.getElementById("seconds");
        this.interval = setInterval(this.refreshTimeDisplay, 1000);
    }

    /**
     * Refreshes the display of time passed;
     */
    refreshTimeDisplay = () => {
        this.timeElapsed++;
        let minutes = parseInt(this.timeElapsed / 60, 10);
        let seconds = this.timeElapsed % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.minutes.textContent = minutes;
        this.seconds.textContent = seconds;
    }   

    /**
     * Provides the final time display for when the game is won;
     */
    provideFinalTime = () => {
        let minutes = parseInt(this.timeElapsed / 60, 10);
        let seconds = this.timeElapsed % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
    }
}