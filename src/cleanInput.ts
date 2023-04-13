

export function cleanInput(input: string, index: object) {
  let value = input.includes(":")
    ? input.split(":")[1]
    : input

  if (value.endsWith(".")) {
    value = value.slice(0, -1)
  }

  return value
    .split(", ")
    .map(x => x.trim())
    .filter(x => !x.includes(",") && !x.includes(";"))
}

