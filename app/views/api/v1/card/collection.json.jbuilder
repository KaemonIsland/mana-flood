# Returns all card attributes
json.(@card, *@card.attributes.keys)

if !@variations.blank?
  json.variations @variations
end

json.collection @card.collection_quantity(@collection.id)