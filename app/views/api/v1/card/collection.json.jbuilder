# Returns all card attributes
json.(@card, *@card.attributes.keys)

if !@variations.blank?
  json.variations @variations
end

json.rulings @card.rulings
json.legalities @card.legalities

json.collection @card.collection_quantity(@collection.id)