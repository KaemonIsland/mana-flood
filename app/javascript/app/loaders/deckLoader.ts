interface DeckLoaderProps {
  id: string
}

export const deckLoader = ({ params }): DeckLoaderProps => ({
  id: params.deckId,
})
