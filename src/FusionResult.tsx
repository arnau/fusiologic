import { createEffect, createMemo, For, onMount, Show } from 'solid-js';
import styles from './FusionResult.module.css'
import wordStyles from './Words.module.css'
import { useStore } from './store';
import { mergeRounds } from './aux';
import { Metrics } from './Metrics';


export function Result() {
  const [{ letterCount, words, rounds, indices, score }]: any = useStore()
  const list = createMemo(() =>
    mergeRounds([[...words()], ...rounds()], indices.words, letterCount))
  const totalScore = () => score(list().map(x => x.tag))
  const length = () => list().length
  const scoreEmoji = () => totalScore()[1]
  const scoreLabel = () => totalScore()[0]

  return (
    <>
      <section class={styles.result}>
        <Show when={list().length > 0} fallback={<p>No tinc paraules! 😶</p>}>
          <h2>Paraules trobades ({length()}) {scoreEmoji()} {scoreLabel()}</h2>
          <ul class={wordStyles.wordList}>
            <For each={list()}>
              {(item, _index) => <ResultItem {...item} />}
            </For>
          </ul>
        </Show>
      </section>
      <Metrics />
    </>
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
