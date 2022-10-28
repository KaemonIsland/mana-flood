export const deckLoader = ({ params }) => {
  console.log(params)

  return { id: params.deckId }
}
