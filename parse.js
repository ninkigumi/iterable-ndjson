import { StringDecoder } from 'string_decoder'

export const parse = async function * (source) {
  const matcher = /\r?\n/
  const decoder = new StringDecoder('utf8')
  let buffer = ''
  for await (const chunk of source) {
    buffer += decoder.write(chunk)
    const parts = buffer.split(matcher)
    buffer = parts.pop()
    for (let i = 0; i < parts.length; i++) yield JSON.parse(parts[i])
  }
  buffer += decoder.end()
  if (buffer) yield JSON.parse(buffer)
}
