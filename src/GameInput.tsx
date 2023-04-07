import styles from './GameInput.module.css'
import { useGameInput } from './GameInputContext'
import { useStore } from "./store"
import type { Bag } from './types'
import { validate } from './aux'


export function GameInput() {
  const [{ letters, requiredLetter, wordMap, words }, { reshuffle, incrementDigram, addWord }]: any = useStore()
  const bag: Bag = { letters: letters(), requiredLetter, wordMap }
  const [{input: source}, { removeLetter, reset: resetSource, replace: replaceSource, replaceSink }]: any = useGameInput()

  const isDisabled = () => source().length == 0
  const submit = () => {
    if (source().length != 0) {
      const isFound = words().has(source())
      const validationResult = validate(source(), bag, isFound)

      replaceSink(validationResult)

      if (validationResult.isValid) {
        addWord(source())
        incrementDigram(source().slice(0, 2))
      }

      resetSource()
    }
  }
  const handleSubmit = (event: KeyboardEvent) => {
    if (event.key == "Enter") {
      submit()
    }
  }
  const handleInput = (event: InputEvent) => {
    const target = event.currentTarget as HTMLInputElement
    replaceSource(target.value)
  }

  return (
    <>
      <div class={styles.input_box}>
        <input
          type="text"
          autocomplete="off"
          value={source()}
          onInput={handleInput}
          onKeyUp={handleSubmit}
        />
      </div>
      <div class={styles.button_set}>
        <button onClick={removeLetter} disabled={isDisabled()}>Suprimeix</button>
        <button onClick={reshuffle}>Remena</button>
        <button onDblClick={
          (event) => {
            event.preventDefault()
            event.stopPropagation()
          }
        } onClick={submit} disabled={isDisabled()}>Introdueix</button>
      </div>
    </>
  )
}
