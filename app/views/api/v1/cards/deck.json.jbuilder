json.pagination do
  json.page @cards.current_page
  json.perPage @cards.limit_value
  json.totalPages @cards.total_pages
  json.total @cards.total_count
end

json.deck do
  json.(@deck, *@deck.attributes.keys)
end

json.stats @deck.card_stats

json.colors @deck.colors

json.cards @deck.decked_cards do |decked_card|
  json.deck do
    json.quantity decked_card.quantity
    json.foil decked_card.foil
  end
  json.categories decked_card.categories

  card = decked_card.card

  # Returns all card attributes
  json.(card, *card.attributes.keys)

  json.collection card.collection_quantity(@collection.id)
  json.locations card.locations(current_user.id)
end
