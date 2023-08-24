import { onBeforeRender } from "../../event/onBeforEvent"

export default (name: string, {
  update,
}) => {
  const executeUpdata = (eventData) => {
    for (const target of [...queued.keys()])
      update!(target, queued.get(target)!, eventData!)
  }
  const queued = new Map()
  const addSystem = (item, data) => {
    queued.set(item, data)
    onBeforeRender(executeUpdata)
    console.log('Added', item, queued)
  }
  return {
    name,
    add: addSystem,
    update: update,
    get queued() {
      return [...queued.keys()]
    }
  }
}