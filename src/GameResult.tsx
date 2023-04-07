import { For, Show, createEffect, createMemo, createSignal } from "solid-js"
import { useStore } from "./store"
import type { DigramValue, Word } from "./types"
import styles from './GameResult.module.css'
import { isTuti, totalScore } from './aux'


export function GameResult() {
  const [legacy, setLegacy] = createSignal(false)
  const [{ letters, words, digramMap, wordMap, stats }]: any = useStore()
  const letterNumber = () => letters().length + 1
  const list = () => {
    const array = [...words()]
    array.sort()

    return array
  }
  const currentPoints = () => totalScore(list(), letterNumber())
  const totalPoints = createMemo(() => totalScore([...wordMap.keys()], letterNumber()))


  const statsSummary = () => [
    `Paraules ${stats().foundWords}/${stats().totalWords}`,
    `Tutis ${stats().foundTutis}/${stats().totalTutis}`,
    `Punts ${currentPoints()}/${totalPoints()}`
  ]

  const groups = () => {
    const result = []

    for (const [digram, value] of Object.entries(digramMap())) {
      const words = list().reduce((acc: any, word: Word) => {

        if (word.slice(0, 2) == digram) {
          acc.push([wordMap.get(word), isTuti(word, letterNumber())])
        }

        return acc
      }, [])
      result.push({ digram, words, total: (value as DigramValue).total })
    }

    return result
  }

  return (
    <div class={styles.result} onDblClick={() => { setLegacy(x => !x) }}>
      <Show when={!legacy()} fallback={<div>{statsSummary().join(' ')}: {list().join(", ")}</div>}>
        <div class={styles.summary}>
          {statsSummary().join('. ')}.
        </div>
        <div class={styles.group_set}>
          <For each={groups()}>
            {
              (group: any) =>
                <Group {...group} letterNumber={letterNumber()} />
            }
          </For>
        </div>
      </Show>
    </div>
  )
}



function Group(props: any) {
  const list = () => props.words
  const count = () => list().length

  return (
    <section class={styles.group}>
      <h1 class={styles.header}>{props.digram} ({count()}/{props.total})</h1>
      <div class={styles.body}>
        <For each={list()}>
          {([word, isTuti]) => <Word isTuti={isTuti} value={word} />}
        </For>
      </div>

    </section>
  )
}

function Word(props: any) {
  return (
    <span classList={{ [styles.word]: true, [styles.tuti]: props.isTuti }}>{props.value}</span>
  )
}
