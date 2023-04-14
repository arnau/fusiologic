import { For, Show } from 'solid-js';

import styles from './Words.module.css';


export function Words(props: { items: string[] }) {
  const items = props.items

  return (
    <Show when={items.length > 0} fallback={<p>No tinc paraules!</p>}>
      <ul class={styles.wordList}>
        <For each={items}>
          {(word, index) => <li data-index={index()} class={styles.word}>{word}</li>}
        </For>
      </ul>
    </Show>
  )
}
