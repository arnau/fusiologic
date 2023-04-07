import { For } from "solid-js"
import { type Cache } from "./types"
import { Words } from "./Words"

import styles from './Rounds.module.css'

export function Rounds(props: { cache: Cache }) {
  const items = props.cache

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
