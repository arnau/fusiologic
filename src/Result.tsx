import { createMemo, For, Show } from 'solid-js';
import { Word } from './Words';

import styles from './Result.module.css'
import wordStyles from './Words.module.css'
import type { RoundList } from './types';
import { useStore } from './store';

interface TaggedWord {
  round: number;
  word: string;
}

function mergeRounds(rounds: RoundList): TaggedWord[] {
  const set: Set<string> = new Set()
  let list: TaggedWord[] = []

  for (const [idx, round] of rounds) {
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

export function Result() {
  const [{ words, rounds }]: any = useStore()
  // const list = createMemo(() => mergeRounds(rounds()))
  const list = createMemo(() => rounds())

  return (
    <div class={styles.result}>
      <Show when={list().length > 0} fallback={<p>No tinc paraules! 😶</p>}>
        <h2>Paraules trobades ({list().length})</h2>
        <ul class={wordStyles.wordList}>
          <For each={list()}>
            {(item, _index) => <ResultItem word={item} />}
          </For>
        </ul>
      </Show>
    </div>
  )
}

function ResultItem(props: any) {
  const classname = `${styles.round} ${styles[`round-${props.round}`]}`

  console.log(props)

  return (
    <li class={wordStyles.word}>
      <span class={classname}><Word>{props.word}</Word></span>
    </li>
  )
}
