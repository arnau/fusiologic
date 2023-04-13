export type Round = Array<string>
export type RoundList = Array<Round>
export type Cache = Array<Round>

export type Letter = string
export type LetterSet = Array<Letter|null>

export type Word = string
export type WordSet = Set<Word>
export type WordIndex = Map<Word, string>

export type Digram = string
export interface DigramIndex {
  [key: Digram]: DigramValue,
}
export type DigramValue = number


export interface Bag {
  letters: LetterSet,
  requiredLetter: Letter,
  wordIndex: Map<string, string>,
}

export interface TaggedWord {
  round: number;
  word: string;
  isTuti: boolean;
}
