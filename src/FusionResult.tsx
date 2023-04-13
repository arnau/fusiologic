import { createMemo, For, Show } from 'solid-js';
import styles from './FusionResult.module.css'
import wordStyles from './Words.module.css'
import type { RoundList, WordIndex, TaggedWord } from './types';
import { useStore } from './store';
import { isTuti } from './aux';


function mergeRounds(rounds: RoundList, wordIndex: WordIndex, letterCount: number): TaggedWord[] {
  const set: Set<string> = new Set()
  let list: TaggedWord[] = []

  for (const [idx, round] of rounds.entries()) {
    for (const word of round) {
      if (!set.has(word)) {
        const wordDisplay = wordIndex.get(word)!
        set.add(word)
        list.push({ round: idx + 1, word: wordDisplay, isTuti: isTuti(word, letterCount) })
      }
    }
  }

  list.sort((a, b) => a.word.localeCompare(b.word, 'ca', { sensitivity: 'base' }))

  return (
    list
  )
}

export function Result() {
  const [{ letterCount, words, rounds, indices }]: any = useStore()
  const list = createMemo(() =>
    mergeRounds([[...words()], ...rounds()], indices.words, letterCount))

  return (
    <section class={styles.result}>
      <Show when={list().length > 0} fallback={<p>No tinc paraules! 😶</p>}>
        <h2>Paraules trobades ({list().length})</h2>
        <ul class={wordStyles.wordList}>
          <For each={list()}>
            {(item, _index) => <ResultItem {...item} />}
          </For>
        </ul>
      </Show>
    </section>
  )
}

function ResultItem(props: any) {
  const classList = {
    [styles.round]: true,
    [styles[`round-${props.round}`]]: true,
    [styles.tuti]: props.isTuti,
  }

  return (
    <li class={wordStyles.word}>
      <span classList={classList}>{props.word}</span>
    </li>
  )
}
