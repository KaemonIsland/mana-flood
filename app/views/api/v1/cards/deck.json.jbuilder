json.array! @cards do |card|
  # Returns all card attributes
  json.(card, *card.attributes.keys)

  json.collection card.collection_quantity(@collection.id)

  json.deck card.deck_quantity(@deck.id)
end