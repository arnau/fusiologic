import { For, Show } from "solid-js"
import { Words } from "./Words"

import styles from './Rounds.module.css'
import { useStore } from "./store"

export function Rounds() {
  const [{ words, rounds }]: any = useStore()
  const list = () => {
    const array = [...words()]
    array.sort()

    return array
  }

  return (
    <>
      <Show when={list().length > 0}>
        <Round data-index={0} index={0} words={list()} />
      </Show>
      <Show when={rounds().length > 0}>
        <For each={rounds()}>
          {(round, index) => <Round index={index() + 1} words={round} />}
        </For>
      </Show>
    </>
  )
}

function Round(props: any) {
  const index = props.index
  const words = props.words

  return (
    <details open={false} class={styles.round}>
      <summary>Ronda {index + 1} ({words.length})</summary>
      <Words items={words} />
    </details>
  )
}
