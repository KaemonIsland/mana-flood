json.array! @collection.cards do |card|
    json.(card, *card.attributes.keys)
    if user_signed_in?
        json.has_card in_collection?(@collection, card)
        json.quantity collection_quantity(current_user.collection, card)
    end
end