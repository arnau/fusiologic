import { createContext, createMemo, createSignal, onMount, useContext } from 'solid-js';
import { today } from './bag';
import { collectDigrams, invertIndex, isTuti, shuffle, totalScore } from './aux';
import { LetterSet, Round, RoundList, Word, WordSet } from './types';


/**
 * Saves into local storage
 */
function save(key: string, state: any) {
  const data = JSON.stringify(state)

  localStorage.setItem(key, data)
}

function load(key: string) {
  const data = localStorage.getItem(key)

  return data !== null ? JSON.parse(data) : null
}

export const StoreContext = createContext()


const levels = [
  ["", ""],
  ["mindundi", "💩"],
  ["croqueta", "🥺"],
  ["mitjania", "😒"],
  ["agut", "😎"],
  ["eixerit", "😏"],
  ["ieni", "🧐"],
]

function find_level(score: number, max_score: number) {
  if (score == 0) { return levels[0]; }

  let percent = (score / max_score) * 100

  if (percent < 10) { return levels[1]; }
  if (percent < 20) { return levels[2]; }
  if (percent < 40) { return levels[3]; }
  if (percent < 70) { return levels[4]; }
  if (percent < 100) { return levels[5]; }

  return levels[6];
}


export function StoreProvider(props: any) {
  const localkey = today.id
  const bagkey = `${localkey}_bag`
  const wordkey = `${localkey}_word`
  const roundskey = `${localkey}_rounds`

  const initialSet = [...today.letters.slice(0, -1)]
  const requiredLetter = today.letters[today.letters.length - 1]
  const wordIndex = new Map(Object.entries(today.words))
  const [letters, setLetters] = createSignal<LetterSet>(shuffle(initialSet))
  const [words, setWords] = createSignal<WordSet>(new Set())
  const [rounds, setRounds] = createSignal<RoundList>([])

  onMount(() => {
    const cache = load(bagkey)

    if (cache === null) {
      save(bagkey, {
        letters: letters(),
        requiredLetter,
        wordIndex: Object.fromEntries(wordIndex.entries()),
      })

      save(wordkey, [...words()])
      save(roundskey, rounds())
    } else {
      setWords(new Set(load(wordkey) as WordSet))
      setRounds(load(roundskey) as RoundList)
    }
  })

  // Derived
  const indices = {
    digrams: collectDigrams([...wordIndex.keys()]),
    words: wordIndex,
    wordsInverted: invertIndex(wordIndex),
  }
  const stats =
    createMemo(() => ({
      foundWords: words().size,
      totalWords: wordIndex.size,
      foundTutis: [...words()].filter(word => isTuti(word, letters().length + 1)).length,
      totalTutis: [...wordIndex.keys()].filter(word => isTuti(word, letters().length + 1)).length,
    }))

  const value = [
    {
      letters,
      requiredLetter,
      letterCount: initialSet.length + 1,
      words,
      indices,
      stats,
      rounds,

      score(list: string[]) {
        const current = totalScore(list, initialSet.length + 1)
        const max = totalScore([...wordIndex.keys()], initialSet.length + 1)

        return find_level(current, max)
      },
    },
    {
      reshuffle() { setLetters(xs => [...shuffle(xs)]) },

      addWord(word: Word) {
        setWords((xs: WordSet) => {
          const list = [...xs, word]
          save(wordkey, list)

          return (new Set(list))
        })
      },

      addRound(round: Round) {
        setRounds((xs: RoundList) => [...xs, round])
        save(roundskey, rounds())
      },

      flushRounds() {
        setRounds([])
        save(roundskey, rounds())
      },

    }
  ]

  return (
    <StoreContext.Provider value={value} >
      {props.children}
    </StoreContext.Provider>
  )
}

export function useStore() { return useContext(StoreContext); }
