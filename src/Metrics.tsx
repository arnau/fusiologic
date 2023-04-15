import { For } from "solid-js"
import { useStore } from "./store"
import { DigramMetrics } from "./types"
import styles from './Metrics.module.css'



export function Metrics() {
  const [{ letters, requiredLetter, words, rounds, indices }]: any = useStore()
  const set = () => new Set([...words(), ...rounds().flat()])
  const list = () => {
    const digrams: DigramMetrics = []

    for (const [digram, total] of Object.entries(indices.digrams)) {
      const found = [...set()].filter(x => x.slice(0, 2) == digram)

      digrams.push([digram, { total: total as number, found: found.length }])
    }

    digrams.sort()

    return digrams
  }

  const zip = (a: Array<any>, b: Array<any>) => a.map((k, i) => [k, b[i]])
  const grid = () => {
    const wordList = [...indices.words.keys()]
    const maxLength = wordList.reduce((acc: number, word: string) =>
      word.length > acc ? word.length : acc, 0) + 2 // extra cell for totals
    const index: Map<string, Array<[number, number]>> = new Map()

    const sigma = "Σ"
    const totalSums = Array(maxLength).fill(0)
    const foundSums = Array(maxLength).fill(0)

    for (const letter of [...letters(), requiredLetter]) {
      const total = wordList.reduce((acc: Array<number>, word: string) => {
        if (word[0] == letter) {
          acc[word.length] += 1
          totalSums[word.length] += 1
        }


        return acc
      }, Array(maxLength).fill(0))

      const found = [...set()].reduce((acc: Array<number>, word: string) => {
        if (word[0] == letter) {
          acc[word.length] += 1
          foundSums[word.length] += 1
        }


        return acc
      }, Array(maxLength).fill(0))


      index.set(letter, zip(found, total) as Array<[number, number]>)
    }


    const header = [...Array(maxLength).keys()].slice(3)
    // @ts-ignore
    header[header.length - 1] = sigma
    const body = [...index.entries(), [sigma, zip(foundSums, totalSums)]]
      .map(([letter, values]) => {
        const sum = (values as Array<[number, number]>).reduce((acc: [number, number], [f, t]: [number, number]) =>
          [acc[0] + f, acc[1] + t], [0, 0])

        // @ts-ignore
        values[13] = sum

        return [letter, values]
      })

    body.sort()

    return ({ header, body })
  }

  return (
    <>
      <section class={styles.section}>
        <ul>
          <For each={list()}>
            {
              ([digram, { found, total }]) => <li>{digram} ({found}/{total})</li>
            }
          </For>
        </ul>
      </section>
      <section class={styles.grid}>
        <table>
          <Header values={grid().header} />
          <For each={grid().body}>
            {
              ([letter, values]) => <Row letter={letter} values={values} />
            }
          </For>
        </table>
      </section>
    </>
  )
}

function Header(props: any) {
  return (
    <thead>
      <tr>
        <td></td>
        <For each={props.values}>
          {
            (n) => <th>{n}</th>
          }
        </For>
      </tr>
    </thead>
  )
}

function Row(props: any) {
  return (
    <tr>
      <th>{props.letter}</th>
      <For each={props.values.slice(3)}>
        {
          ([found, total]) => <td>{found}/{total}</td>
        }
      </For>
    </tr>
  )
}
