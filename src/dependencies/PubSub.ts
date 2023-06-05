type Subscriber<T extends unknown[]> = (...args: T) => void;

export class PubSub<T extends unknown[]> {
  #subscribers: Subscriber<T>[] = [];

  subscribe(subscriber: Subscriber<T>) {
    this.#subscribers.push(subscriber);

    return () => this.unsubscribe(subscriber);
  }

  unsubscribe(subscriber: Subscriber<T>) {
    this.#subscribers = this.#subscribers.filter((sub) => sub !== subscriber);
  }

  publish(...args: T) {
    for (const subscriber of this.#subscribers) {
      subscriber(...args);
    }
  }
}
