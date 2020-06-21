# Returns all card attributes
json.(@card, *@card.attributes.keys)

if !@variations.nil?
  json.variations @variations
end

json.collection @card.collection_quantity(@collection.id)

json.deck @card.deck_quantity(@deck.id)