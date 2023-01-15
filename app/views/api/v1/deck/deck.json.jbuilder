json.(@deck, *@deck.attributes.keys)

json.colors @deck.colors

json.stats @deck.card_stats

json.categories @deck.categories do |category|
  json.name category.name
  json.includedInDeck category.included_in_deck
  json.includedInPrice category.included_in_price
end

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
