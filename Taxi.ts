class Route {
    static stops = 5;
    static timeBetweenStops = 0.05;
    static passangerFlowDencity = 2;
}

class Taxi {
    private static timeForPassanger = 0.005;
    private static maxVolume = 10;

    private insiders: number = 0;
    private stopIndex = 0;

    stopSignal() {
        return false;
    }

    constructor(straightforward = true) {
        this.stopIndex = straightforward ? 0 : Route.stops;
    }

    waitPassangers(quantity): void {
        Helpers.wait(quantity * Taxi.timeForPassanger);
    }

    move(): void {
        while (!this.stopSignal()) {
            if (this.stopIndex===Route.stops-1 || this.stopIndex===2*Route.stops-1){
                this.openDoors();
                this.waitPassangers(this.insiders);
                this.insiders=0;
                this.closeDoors();
            }
            else {
                this.next();
            }

            this.stopIndex = (this.stopIndex+1)%(2*Route.stops);
            Helpers.wait(Route.timeBetweenStops);
        }
    }

    openDoors(): void {
        console.log('stop #'+this.stopIndex+',doors opened at time:' + Helpers.currentTime());
    }

    closeDoors(): void {
        console.log('closed at ' + Helpers.currentTime() + ', people inside: ' + this.insiders);
    }

    next(): void {
        let outPeople: number = Helpers.rangedRandom(this.insiders);
        let inPeople: number = Helpers.rangedRandom(Route.passangerFlowDencity);

        if (outPeople === 0 && this.insiders === Taxi.maxVolume) return;

        this.openDoors();
        this.waitPassangers(outPeople);
        this.insiders -= outPeople;

        if (this.insiders + inPeople >= Taxi.maxVolume) {
            this.insiders = Taxi.maxVolume;
            this.waitPassangers((Taxi.maxVolume - this.insiders));
            this.closeDoors();
            return;
        }

        this.waitPassangers(inPeople);
        this.insiders += inPeople;

        Helpers.wait(0.5);
        inPeople = Helpers.rangedRandom(Route.passangerFlowDencity);
        if (this.insiders + inPeople >= Taxi.maxVolume) {
            this.insiders = Taxi.maxVolume;
        }
        else {
            this.insiders += inPeople;
        }
        this.closeDoors();
    }
}

class Helpers {
    static currentTime(): string {
        let today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        return '' + h + ':' + s + ':' + s;
    }

    static rangedRandom(max): number {
        return Math.round(Math.random() * (max))
    }

    static wait(s): void {
        let start = new Date().getTime();
        let end = start;
        while (end < start + s * 1000) {
            end = new Date().getTime();
        }
    }
}

(new Taxi()).move();