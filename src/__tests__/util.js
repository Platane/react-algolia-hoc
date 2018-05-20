export const wait = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))

export const waitFor = async (expr: () => boolean) => {
  for (let i = 50; i--; ) {
    const res = await expr()

    if (res) return res

    await wait(100)
  }

  throw new Error('timeout')
}
