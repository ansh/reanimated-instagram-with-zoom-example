export type Post = {
  id: number
  thumbnailUri: string
  originalUri: string
}

export const images: Post[] = [...Array(30).keys()].map((index) => {
  const _baseUri = `https://picsum.photos/id/${index + 200}`
  return {
    id: index + 1,
    thumbnailUri: `${_baseUri}/200/200?grayscale`,
    originalUri: `${_baseUri}/500/500`,
  }
})
