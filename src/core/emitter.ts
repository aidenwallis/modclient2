import { raf } from "~/utils/raf";

export type Subscriber = () => void;
type GlobalEventHandler<T, P> = (t: T, payload: P) => void;
type EventHandler<T> = (data: T) => void;

// Emitter is a class which allows you to build a basic abstraction which can emit an event type
// to a group of subscribers about a range of topics, it will not block the event loop, and defers
// all events.
export class Emitter<EventTypes extends string | number, EventSchema> {
  private globalSubscribers: GlobalEventHandler<EventTypes, EventSchema>[] = [];
  private subscribers: Partial<
    Record<EventTypes, EventHandler<EventSchema>[]>
  > = {};
  private dequeuing = false;
  private queue: [EventTypes, EventSchema][] = [];

  public publish(t: EventTypes, data: EventSchema) {
    this.queue.push([t, data]);
    if (this.dequeuing) {
      return;
    }
    // run queue if empty
    this.dequeue();
  }

  public subscribe<T extends EventSchema>(
    t: EventTypes,
    ref: (data: T) => void
  ): Subscriber {
    if (this.subscribers[t]) {
      this.subscribers[t]?.push(ref);
    } else {
      this.subscribers[t] = [ref];
    }

    return () => {
      const i = this.subscribers[t]?.indexOf(ref);
      i !== -1 && i !== undefined && this.subscribers[t]?.splice(i, 1);
    };
  }

  public subscribeAll(ref: GlobalEventHandler<EventTypes, EventSchema>) {
    this.globalSubscribers.push(ref);
    return () => {
      const i = this.globalSubscribers.indexOf(ref);
      i !== -1 && this.globalSubscribers.splice(i, 1);
    };
  }

  private dequeue() {
    this.dequeuing = true;

    raf(() => {
      const evt = this.queue.shift();
      if (!evt) {
        this.dequeuing = false;
        return;
      }

      const [t, data] = evt;
      for (let i = 0; i < this.globalSubscribers.length; ++i) {
        this.globalSubscribers[i](t, data);
      }

      const subscribers = this.subscribers[t];
      if (subscribers) {
        for (let i = 0; i < subscribers.length; ++i) {
          subscribers[i](data);
        }
      }

      raf(() => this.dequeue());
    });
  }
}
