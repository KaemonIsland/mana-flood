json.array! @collection.cards do |card|
    json.(card, *card.attributes.keys)
    if user_signed_in?
        json.has_card has_card?(current_user, card)
        json.quantity collection_quantity(current_user, card)
    end
end