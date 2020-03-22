module CollectionUtils
    extend ActiveSupport::Concern

  def has_card?(user, card)
    return false unless user && card
    
    user.collection.collected_cards.exists?(card_id: card.id)
  end

  # Returns the quantity of cards in a users collection for a specific card.
  def collection_quantity(user, card)
    return false unless user && card

    if has_card?(user, card)
        user.collection.collected_cards.find_by(card_id: card.id).quantity
    end
  end
end
  