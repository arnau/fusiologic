

export function cleanInput(input: string, index: Map<string, string>) {
  let value = input.includes(":")
    ? input.trim().split(":")[1]
    : input.trim()

  if (value.endsWith(".")) {
    value = value.slice(0, -1)
  }

  const list = value
    .split(", ")
    .reduce((acc: Array<string>, token: string) => {
      const phrase = token.trim()
      const word = index.get(phrase)

      if (word !== undefined) {
        acc.push(word!)
      }

      return acc
    }, [])

    list.sort()

    return list
}
