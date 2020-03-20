
type Callback<T> = ((obj: T) => void)

export class GameEventEmitter<T> {
    onces: Callback<T>[] = [];
    ons: ((obj: T) => void)[] = [];

    public constructor() {
        this.on = this.on.bind(this);
        this.once = this.once.bind(this);
        this.trigger = this.trigger.bind(this);
    }

    public once(...onces: Callback<T>[]) {
        onces.forEach(o => this.onces.push(o));
        return this;
    }

    public on(...ons: Callback<T>[]) {
        ons.forEach(o => this.ons.push(o));
        return this;
    }

    public trigger(obj: T) {
        this.onces.forEach(x => x(obj));
        this.onces = [];

        this.ons.forEach(x => x(obj));
    }
}