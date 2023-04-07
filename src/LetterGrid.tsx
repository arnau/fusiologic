import { Index } from "solid-js"
import type { Letter } from "./types"
import { useGameInput } from "./GameInputContext"
import { useStore } from "./store"

interface LetterGrid {
  letters: () => Array<Letter>,
  required: Letter
}


export function LetterGrid() {
  const [{ letters, requiredLetter }]: any = useStore()
  const [, { addLetter }] = useGameInput()

  const normalised = () => letters().length == 6 ? letters() : [...letters(), null]

  const list = () =>
    [
      ...normalised().slice(0, 3),
      requiredLetter,
      ...normalised().slice(3),
    ]

  const handleAddLetter = (event: Event) => {
    event.stopPropagation()

    const target = event.target as HTMLElement

    if (target.tagName == "BUTTON") {
      const value = target.textContent ?? ""
      addLetter(value)
    }
  }

  return (
    <div class="letter-grid" onClick={handleAddLetter}>
      <Index each={list()}>
        {(letter, idx) => <LetterBox value={letter()} isRequired={idx == 3} />}
      </Index>
    </div>
  )
}

function LetterBox(props: any) {
  const classList = props.isRequired ? "letterbox required" : "letterbox"

  return (
    <button class={classList} disabled={props.value === null}>
      <svg height="84" width="84" viewBox="0 0 64 64">
        <g transform="scale(0.5 0.5)">
          <polygon points="64 0, 128 34, 128 94, 64 128, 0 94, 0 34"
            stroke-width="0"
          />
          <text x="100%" y="100%">{props.value}</text>
        </g>
      </svg>
    </button>
  )
}
