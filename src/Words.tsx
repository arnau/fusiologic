import { For, Show } from 'solid-js';

import styles from './Words.module.css';


export function Words(props: { items: string[] }) {
  const items = props.items

  return (
    <Show when={items.length > 0} fallback={<p>No tinc paraules!</p>}>
      <ul class={styles.wordList}>
        <For each={items}>
          {(item, index) => <li data-index={index()} class={styles.word}><Word>{item}</Word></li>}
        </For>
      </ul>
    </Show>
  )
}

export function Word(props: { children: string }) {
  const text = props.children
  const word = text.split(" ", 1)[0]
  const letters = new Set(word.split("").filter(x => x.match(/[a-z]/)))

  return (
    letters.size == 7
      ? <span class={styles.tuti}>{text}</span>
      : text
  )
}

