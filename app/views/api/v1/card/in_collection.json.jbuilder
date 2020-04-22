# Returns all card attributes
json.(@card, *@card.attributes.keys)

json.collection do
  # Sets up collection information. has_card, and 
  if user_signed_in?
      json.has_card in_collection?(@collection, @card)
  end

  if in_collection?(@collection, @card)
      json.quantity collection_quantity(@collection, @card)
  end
end