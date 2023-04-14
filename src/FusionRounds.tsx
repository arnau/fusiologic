import { For } from "solid-js"
import { Words } from "./Words"

import styles from './Rounds.module.css'
import { useStore } from "./store"

export function Rounds() {
  const [{words, rounds}]: any = useStore()
  const items = [[...words()], ...rounds()]

  return (
    <For each={items}>
      {(item, index) => <Round data-index={index} index={index()} words={item} />}
    </For>
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
