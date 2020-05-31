# Returns all card attributes
json.(@card, *@card.attributes.keys)

if !@variations.nil?
  json.variations @variations
end

json.collection do
  # Sets up collection information. has_card, and 
  if user_signed_in?
      json.has_card in_collection?(@collection, @card)
  end

  if in_collection?(@collection, @card)
      json.quantity collection_quantity(@collection, @card)
  end
end

json.deck do
  # Shows the user deck counts. has_card and count
  if user_signed_in?
    json.has_card in_deck?(@deck, @card)
  end

  if in_deck?(@deck, @card)
      json.quantity deck_quantity(@deck, @card)
  end
end