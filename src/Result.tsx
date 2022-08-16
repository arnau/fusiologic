
import { createMemo, For, Show } from 'solid-js';
import { Word } from './Words';

import styles from './Result.module.css'
import wordStyles from './Words.module.css'
import { type Cache } from './App';

interface TaggedWord {
  round: number;
  word: string;
}

function mergeRounds(rounds: Cache): TaggedWord[] {
  const set: Set<string> = new Set()
  let list: TaggedWord[] = []

  for (const [idx, round] of rounds.entries()) {
    for (const word of round) {
      if (!set.has(word)) {
        set.add(word)
        list.push({ round: idx + 1, word })
      }
    }
  }

  list.sort((a, b) => a.word.localeCompare(b.word, 'ca', { sensitivity: 'base' }))

  return (
    list
  )
}

export function Result(props: { cache: Cache }) {
  const rounds = props.cache
  const list = createMemo(() => mergeRounds(rounds))

  return (
    <details open={true} class={styles.result}>
      <Show when={list().length > 0} fallback={<p>No tinc paraules! 😶</p>}>
        <summary>Paraules trobades ({list().length})</summary>
        <ul class={wordStyles.wordList}>
          <For each={list()}>
            {(item, _index) => <ResultItem {...item} />}
          </For>
        </ul>
      </Show>
    </details>
  )
}

function ResultItem(props: any) {
  const classname = `${styles.round} ${styles[`round-${props.round}`]}`

  return (
    <li class={wordStyles.word}>
      <span class={classname}><Word>{props.word}</Word></span>
    </li>
  )
}
