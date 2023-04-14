import { createContext, createMemo, createSignal, onMount, useContext } from 'solid-js';
import { today } from './bag';
import { collectDigrams, invertIndex, isTuti, shuffle } from './aux';
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

  // setWords(new Set([...wordMap.keys()]))

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
