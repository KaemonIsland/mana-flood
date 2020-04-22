json.array! @card_set.cards do |card|
    json.(card, *card.attributes.keys)
    if user_signed_in?
        json.has_card in_collection?(current_user.collection, card)
    end

    if in_collection?(current_user.collection, card)
        json.quantity collection_quantity(current_user.collection, card)
    end
end