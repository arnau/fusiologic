import { createEffect, createSignal } from 'solid-js';
import { createStore, type SetStoreFunction, type Store } from "solid-js/store";

import styles from './App.module.css';
import { Rounds } from './Round';
import { Result } from './Result';


function createLocalStore<T extends object>(
  name: string,
  init: T
): [Store<T>, SetStoreFunction<T>] {
  // XXX: clean old version
  localStorage.removeItem("words")

  const localState = localStorage.getItem(name)
  const seed = localState ? JSON.parse(localState) : init
  const [state, setState] = createStore<T>(seed)

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

function cleanInput(input: string) {
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


function Input(props: any) {
  const [input, setInput] = createSignal("")
  const setCache = props.setCache

  const setter = (value: string) => {
    const round = cleanInput(value)
    setCache((rounds: Cache) => [...rounds, round])
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

  const handleCleanup = () => {
    setCache([])
  }

  return (
    <form class={styles.inputForm} onSubmit={handleSubmit}>
      <textarea
        onInput={handleInput}
        value={input()}
        placeholder="Has trobat 2 paraules de les 182 possibles (i cap tuti dels 6 que hi ha): nat, net."
        autofocus={true}
      ></textarea>

      <div class={styles.buttonSet}>
        <button type="submit">Afegeix</button>
        <button type="button" onClick={handleCleanup}>Neteja cache</button>
      </div>
    </form>
  )
}

export function FusionScreen() {
  const [cache, setCache] = createLocalStore<Cache>("fusiologic", [])
  const urlParams = new URLSearchParams(location.search)

  if (urlParams.has("fingerprint")) {
    const fingerprint = urlParams.get("fingerprint")!
    const data = atob(fingerprint)
    setCache(JSON.parse(data))
  }

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>Fusiològic</h1>
      </header>
      <main>
        <Input setCache={setCache} cache={cache} />
        <Rounds cache={cache} />
        <Result cache={cache} />
      </main>
    </div>
  )
}
