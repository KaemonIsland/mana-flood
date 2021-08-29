module CollectionUtils
    extend ActiveSupport::Concern
  def in_collection?(collection, card)
    return false unless collection && card
    
    collection.collected_cards.exists?(card_id: card.id)
  end

  # Returns the quantity of cards in a users collection for a specific card.
  def collection_quantity(collection, card)
    return false unless collection && card

    if in_collection?(collection, card)
      collection.collected_cards.find_by(card_id: card.id)
    end
  end

  def in_deck?(deck, card)
    return false unless deck && card

    deck.decked_cards.exists?(card_id: card.id)
  end

  def deck_quantity(deck, card)
    return false unless deck && card

    if in_deck?(deck, card)
      deck.decked_cards.find_by(card_id: card.id)
    end
  end
end
  