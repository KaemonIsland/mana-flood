json.page @cards.current_page
json.perPage @cards.limit_value
json.totalPages @cards.total_pages
json.total @cards.total_count

json.cards @cards do |card|
  # Returns all card attributes
  json.(card, *card.attributes.keys)

  json.collection card.collection_quantity(@collection.id)
end
