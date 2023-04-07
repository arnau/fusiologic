import { createContext, createSignal, useContext } from "solid-js";
import type { Letter } from "./types";

type GameInput = any

export const GameInputContext = createContext<GameInput>()
export function useGameInput() { return useContext<GameInput>(GameInputContext); }

export interface DisplayValue {
  isValid: boolean,
  value: string,
  reason?: string,
}

function asValue(value: string): DisplayValue {
  return ({ isValid: true, value })
}

const INIT_VALUE = asValue("")

export function GameInputProvider(props: any) {
  const [input, setInput] = createSignal("")
  const [display, setDisplay] = createSignal(INIT_VALUE)
  const [timeoutId, setTimeoutId] = createSignal<number | null>(null)


  const value: any = [
    {
      input,
      display
    },
    {
      reset() { setInput("") },
      replace(text: string) {
        setInput(text)
      },
      addLetter(letter: Letter) {
        setInput(text => text + letter)
      },
      removeLetter() {
        setInput((text: string) => text.slice(0, -1))
      },
      isEmpty() {
        return input().length == 0
      },

      resetSink() { setDisplay(INIT_VALUE) },
      replaceSink(value: DisplayValue) {
        if (timeoutId() !== null) {
          clearTimeout(timeoutId()!)
        }

        setDisplay(value)

        const toid = setTimeout(() => {
          setTimeoutId(null)
          setDisplay(INIT_VALUE)
        }, 1500)
        setTimeoutId(toid)
      },

    }
  ]

  return (
    <GameInputContext.Provider value={value}>
      {props.children}
    </GameInputContext.Provider>
  )
}
