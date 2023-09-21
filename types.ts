export type Post = {
  id: number
  thumbnailUri: string
  originalUri: string
}


export type Routes = {
  Home: undefined
  Detail: {
    item: Post
  }
}