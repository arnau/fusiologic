import { For, Show, createMemo, createSignal } from "solid-js"
import { useStore } from "./store"
import type { DigramValue, Word } from "./types"
import styles from './GameResult.module.css'
import { isTuti, totalScore } from './aux'


export function GameResult() {
  const [legacy, setLegacy] = createSignal(false)
  const [{ letters, words, indices, stats, score }]: any = useStore()
  const letterNumber = () => letters().length + 1
  const list = () => {
    const array = [...words()]
    array.sort()

    return array
  }
  const currentPoints = () => totalScore(list(), letterNumber())
  const totalPoints = createMemo(() =>
    totalScore([...indices.words.keys()], letterNumber()))

  const statsSummary = () => [
    `Paraules ${stats().foundWords}/${stats().totalWords}`,
    `Tutis ${stats().foundTutis}/${stats().totalTutis}`,
    `Punts ${currentPoints()}/${totalPoints()}`
  ]

  const groups = () => {
    const result = []

    for (const [digram, value] of Object.entries(indices.digrams)) {
      const words = list().reduce((acc: any, word: Word) => {

        if (word.slice(0, 2) == digram) {
          acc.push([indices.words.get(word), isTuti(word, letterNumber())])
        }

        return acc
      }, [])
      result.push({ digram, words, total: (value as DigramValue) })
    }

    return result
  }

  const listDisplay = () => list().map(x => indices.words.get(x)).join(", ")

  return (
    <div class={styles.result} onDblClick={() => { setLegacy(x => !x) }}>
      <Show when={!legacy()} fallback={<div>{statsSummary().join(' ')}: {listDisplay()}</div>}>
        <div class={styles.summary}>
          {statsSummary().join('. ')}. {score(list())[1]} {score(list())[0]}
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
