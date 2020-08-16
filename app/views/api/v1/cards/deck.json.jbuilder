json.pagination do
  json.page @cards.current_page
  json.perPage @cards.limit_value
  json.totalPages @cards.total_pages
  json.total @cards.total_count
end

json.stats @deck.card_stats

json.deck do
  json.(@deck, *@deck.attributes.keys)
end

json.colors @deck.colors

json.cards @cards do |card|
  # Returns all card attributes
  json.(card, *card.attributes.keys)

  json.collection card.collection_quantity(@collection.id)
  json.deck card.deck_quantity(@deck.id)
end