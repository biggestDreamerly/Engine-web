export type System<GO, Data> = {
  name: string,
  queued: Array<GO>
  add: (item: GO, data: Data) => void
}

export const loadSystemMap = new Map<string, System<any, any>>()