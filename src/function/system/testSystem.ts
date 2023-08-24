import createSystem from "./utils/createSystem";

export const testSystem = createSystem('testSystem', {
  update: (queued) => {
    // console.log('testSystem')
    // for (const iterator of queued) {
    //   // console.log()
    //   // iterator.n += 0.1
    // }
  },
})