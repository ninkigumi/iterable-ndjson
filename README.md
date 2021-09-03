# iterable-ndjson

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Takes an (async) iterable that yields ndjson and returns an async iterable that yields JS objects

## Install

```sh
npm install iterable-ndjson
```

## Usage

```js
import { ndjson } from 'iterable-ndjson'
const it = ndjson.parse(source) // where `source` is any iterable that yields ndjson
// Note: `parse` is the default export, so you can also use it like `ndjson(source)`

for await (const obj of it)
  console.log(obj)
```

### Examples

Node.js streams are async iterable:

```js
import { ndjson } from 'iterable-ndjson'
import fs from 'fs'
const source = fs.createReadStream('/path/to/file.ndjson')

for await (const obj of ndjson.parse(source))
  console.log(obj)
```

Async iterable:

```js
import { ndjson } from 'iterable-ndjson'

// An ndjson async iterator
const source = (() => {
  const array = ['{"id": 1}\n', '{"id"', ': 2}', '\n{"id": 3}\n']
  return {
    [Symbol.asyncIterator] () {
      return this
    },
    async next () {
      await new Promise(resolve => setTimeout(resolve))
      return array.length
        ? { done: false, value: array.shift() }
        : { done: true }
    }
  }
})()

const main = async ()=>{
  for await (const obj of ndjson.parse(source))
    console.log(obj)
    // Logs out:
    // { id: 1 }
    // { id: 2 }
    // { id: 3 }
}

main()
```

Async iterable generator:

```js
import { ndjson } from 'iterable-ndjson'

// An ndjson async iterator
const source = (async function * () {
  const array = ['{"id": 1}\n', '{"id"', ': 2}', '\n{"id": 3}\n']
  for (let i = 0; i < array.length; i++) {
    yield new Promise(resolve => setTimeout(() => resolve(array[i])))
  }
})()

const main = async ()=>{
  for await (const obj of ndjson.parse(source))
    console.log(obj)
    // Logs out:
    // { id: 1 }
    // { id: 2 }
    // { id: 3 }
}

main()
```

Regular iterable (like an array):

```js
import { ndjson } from 'iterable-ndjson'
const source = ['{"id": 1}\n', '{"id"', ': 2}', '\n{"id": 3}\n']

const main = async ()=>{
  for await (const obj of ndjson.parse(source))
    console.log(obj)
    // Logs out:
    // { id: 1 }
    // { id: 2 }
    // { id: 3 }
}

main()
```

Stringify JS objects to NDJSON:

```js
import { ndjson } from 'iterable-ndjson'
const source = [{ id: 1 }, { id: 2 }, { id: 3 }]

const main = async ()=>{
  for await (const obj of ndjson.stringify(source))
    console.log(obj)
    // Logs out:
    // '{"id":1}\n'
    // '{"id":2}\n'
    // '{"id":3}\n'
}

main()
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ninkigumi/iterable-ndjson/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw, Teruyuki Kobayashi
