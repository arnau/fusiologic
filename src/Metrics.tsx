import { For, createEffect } from "solid-js"
import { useStore } from "./store"
import { Digram, DigramValue } from "./types"
import styles from './Metrics.module.css'



export function Metrics() {
  const [{ digramMap }]: any = useStore()
  const list = () => {
    const array: Array<[Digram, DigramValue]> = Object.entries(digramMap())
    array.sort()

    return array
  }

  createEffect(() => {
    // console.log(list())
  })

  return (
    <div class={styles.digrams}>
      <For each={list()} fallback={<div>Loading...</div>}>
        {([digram, { found, total }]: [Digram, DigramValue]) =>
          <div class={styles.item}>
            <span class={styles.key}>{digram} </span>
            <span class={styles.value}>
              <span class={styles.number}>{found()}</span>/<span class={styles.total}>{total}</span>
            </span>
          </div>
        }
      </For>
    </div>
  )
}
