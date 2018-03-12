var Route = /** @class */ (function () {
    function Route() {
    }
    Route.stops = 5;
    Route.timeBetweenStops = 0.05;
    Route.passangerFlowDencity = 2;
    return Route;
}());
var Taxi = /** @class */ (function () {
    function Taxi(straightforward) {
        if (straightforward === void 0) { straightforward = true; }
        this.insiders = 0;
        this.stopIndex = 0;
        this.stopIndex = straightforward ? 0 : Route.stops;
    }
    Taxi.prototype.stopSignal = function () {
        return false;
    };
    Taxi.prototype.waitPassangers = function (quantity) {
        Helpers.wait(quantity * Taxi.timeForPassanger);
    };
    Taxi.prototype.move = function () {
        while (!this.stopSignal()) {
            if (this.stopIndex === Route.stops - 1 || this.stopIndex === 2 * Route.stops - 1) {
                this.openDoors();
                this.waitPassangers(this.insiders);
                this.insiders = 0;
                this.closeDoors();
            }
            else {
                this.next();
            }
            this.stopIndex = (this.stopIndex + 1) % (2 * Route.stops);
            Helpers.wait(Route.timeBetweenStops);
        }
    };
    Taxi.prototype.openDoors = function () {
        console.log('stop #' + this.stopIndex + ',doors opened at time:' + Helpers.currentTime());
    };
    Taxi.prototype.closeDoors = function () {
        console.log('closed at ' + Helpers.currentTime() + ', people inside: ' + this.insiders);
    };
    Taxi.prototype.next = function () {
        var outPeople = Helpers.rangedRandom(this.insiders);
        var inPeople = Helpers.rangedRandom(Route.passangerFlowDencity);
        if (outPeople === 0 && this.insiders === Taxi.maxVolume)
            return;
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
    };
    Taxi.timeForPassanger = 0.005;
    Taxi.maxVolume = 10;
    return Taxi;
}());
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.currentTime = function () {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        return '' + h + ':' + s + ':' + s;
    };
    Helpers.rangedRandom = function (max) {
        return Math.round(Math.random() * (max));
    };
    Helpers.wait = function (s) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + s * 1000) {
            end = new Date().getTime();
        }
    };
    return Helpers;
}());
(new Taxi()).move();
