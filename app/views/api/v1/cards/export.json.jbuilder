json.cards @cards do |card|
  # Returns card uuid
  json.uuid card.card.uuid
  json.quantity card.quantity
  json.foil card.foil
end

# Use deck quantity when exporting deck
json.decks @decks do |deck|
  json.name deck.name
  json.description deck.description
  json.format deck.format

  json.cards deck.decked_cards do |decked_card|
    json.uuid decked_card.card.uuid
    json.quantity decked_card.quantity
    json.foil decked_card.foil
  end
end
