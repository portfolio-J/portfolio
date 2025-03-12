type EventHandler = { type: string; selector: string; handler: (e: Event) => void };

const eventHolder: EventHandler[] = [];

export type { EventHandler };
export { eventHolder };
