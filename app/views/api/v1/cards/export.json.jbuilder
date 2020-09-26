json.cards @cards do |card|
  # Returns card uuid
  json.uuid card.uuid

  # Use collection quantity if exporting collection
  if @collection
    json.quantity card.collection_quantity(@collection.id)
  end

  # Use deck quantity if exporting deck
  if @deck
    json.deck card.deck_quantity(@deck.id)
  end
end
