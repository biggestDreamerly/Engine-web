import { event } from "@lincode/events"
import { Cancellable } from "@lincode/promiselikes";

export const [emitBeforeRender, onBeforeRender] = event()