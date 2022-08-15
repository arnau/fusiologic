import { createEffect, createSignal, For, Show } from 'solid-js';
import { createStore, SetStoreFunction, Store } from "solid-js/store";

import styles from './App.module.css';


function createLocalStore<T extends object>(
  name: string,
  init: T
): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem(name)
  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init
  )
  createEffect(() => {
    const params = new URLSearchParams(location.search)
    const fingerprint = params.get("fingerprint")
    const data = JSON.stringify(state)
    const newFingerprint = btoa(data)

    localStorage.setItem(name, data)

    if (fingerprint !== newFingerprint) {
      params.set("fingerprint", newFingerprint)

      const newRelativePathQuery = `${location.pathname}?${params.toString()}`
      history.pushState(null, '', newRelativePathQuery)
    }
  })

  return [state, setState]
}


function clean(input: string) {
  let value = input.includes(":")
    ? input.split(":")[1]
    : input

  if (value.endsWith(".")) {
    value = value.slice(0, -1)
  }

  return value
    .split(", ")
    .map(x => x.trim())
    .filter(x => !x.includes(",") && !x.includes(";"))
}


function Mu(props: any) {
  const [input, setInput] = createSignal("")
  const [fresh, setFresh] = createSignal<string[]>([])
  const words = props.words
  const setWords = props.setWords
  const setter = (value: string) => {
    const oldWords = new Set(words)
    const newWords = clean(value)
    const combined = new Set([...words, ...newWords])
    const freshWords = []

    for (const item of newWords) {
      if (!oldWords.has(item)) {
        freshWords.push(item)
      }
    }

    setFresh(freshWords)

    setWords([...combined])
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    setter(input())
    setInput("")
  }

  const handleInput = (e: any) => {
    if (e.inputType == "insertLineBreak") {
      handleSubmit(e)
    } else {
      setInput(e.currentTarget.value)
    }
  }

  return (
    <>
      <form class={styles.inputForm} onSubmit={handleSubmit}>
        <textarea
          onInput={handleInput}
          value={input()}
          placeholder="Has trobat 2 paraules de les 182 possibles (i cap tuti dels 6 que hi ha): nat, net."
          autofocus={true}
        ></textarea>

        <div class={styles.buttonSet}>
          <button type="submit">Afegeix</button>
          <button type="button" onClick={() => setWords([])}>Neteja cache</button>
        </div>
      </form>
      <details open={false} class={styles.freshwords}>
        <summary>Paraules noves ({fresh().length})</summary>
        <ul class={styles.wordList}>
          <For each={fresh()} fallback={<p>Cap paraula nova</p>}>
            {(item, index) => <li data-index={index()} class={styles.word}>{item}</li>}
          </For>
        </ul>

      </details>
    </>
  )
}

function Words(props: { items: string[] }) {
  const items = props.items

  return (
    <div class={styles.result}>
      <p>Paraules trobades: {items.length}</p>
      <Show when={items.length > 0}>
        <ul class={styles.wordList}>
          <For each={items}>
            {(item, index) => <li data-index={index()} class={styles.word}><Word>{item}</Word></li>}
          </For>
        </ul>
      </Show>
    </div>
  )
}

function Word(props: { children: string }) {
  const text = props.children
  const word = text.split(" ", 1)[0]
  const letters = new Set(word.split("").filter(x => x.match(/[a-z]/)))

  return (
    letters.size == 7
      ? <span class={styles.tuti}>{text}</span>
      : text
  )
}

function App() {
  const [words, setWords] = createLocalStore<string[]>("words", [])
  const urlParams = new URLSearchParams(location.search)

  if (urlParams.has("fingerprint")) {
    const fingerprint = urlParams.get("fingerprint")!
    const data = atob(fingerprint)
    setWords(JSON.parse(data))
  }

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>Fusiològic</h1>
      </header>
      <main>
        <Mu setWords={setWords} words={words} />

        <Words items={words} />
      </main>
    </div>
  );
};

export default App;
