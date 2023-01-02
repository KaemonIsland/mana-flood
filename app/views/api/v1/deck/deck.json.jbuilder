json.(@deck, *@deck.attributes.keys)

json.colors @deck.colors

json.stats @deck.card_stats

json.categories @deck.categories do |category|
  json.name category.name
  json.includedInDeck category.included_in_deck
  json.includedInPrice category.included_in_price
end
