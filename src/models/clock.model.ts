export class Clock {
    static time = 0;

    static updateTime() {
        Clock.time += 1;
        setTimeout(Clock.updateTime, 1000);
    }
}