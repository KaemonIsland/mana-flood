json.array! @deck.cards do |card|
  json.(card, *card.attributes.keys)
  if user_signed_in?
      json.has_card in_deck?(@deck, card)
      json.quantity deck_quantity(@deck, card)
  end
end