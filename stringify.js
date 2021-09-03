export const stringify = async function * () {
  for await (const obj of source) {
    yield JSON.stringify(obj) + '\n'
  }
}
