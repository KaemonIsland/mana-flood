class Api::V1::CollectionController < ApplicationController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def export
    if current_user
      @collection = current_user.collection
      @cards = @collection.collected_cards
      @decks = current_user.decks

      render 'api/v1/cards/export.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def import
    if current_user
      @collection = current_user.collection

      permitted = params.permit(
        cards: [:uuid, :quantity, :foil],
        decks: [:name, :description, :format, cards: [:uuid, :quantity, :foil]]
      )

      @cards = permitted[:cards]
      @decks = permitted[:decks]

      # Imports all cards into a collection
      @cards.each do |card|
        imported = Card.find_by(uuid: card[:uuid])

        quantity = card[:quantity].to_i || 0
        foil = card[:foil].to_i || 0

          # Updates card quantity if already in collection
          if in_collection?(@collection, imported)
            @collected_card = @collection.collected_cards.find_by(card_id: imported.id)

            updated_quantity = @collected_card.quantity + quantity
            updated_foil = @collected_card.foil + foil

            @collected_card.update(quantity: updated_quantity, foil: updated_foil)
          else
            # Add card to collection
            CollectedCard.create({ card_id: imported.id, quantity: quantity, foil: foil, collection_id: @collection.id })
          end
      end

      # Imports all decks and decked cards into a collection
      @decks.each do |deck|
        deck_params = { name: deck[:name], description: deck[:description], format: deck[:format] }

        new_deck = current_user.decks.create(deck_params)

        if new_deck
          deck[:cards].each do |card|

            card_id = Card.find_by(uuid: card[:uuid]).id

            quantity = card[:quantity].to_i || 0
            foil = card[:foil].to_i || 0

            new_deck.decked_cards.create({ card_id: card_id, quantity: quantity, foil: foil })
          end
        end
      end

      render json: { success: 'Collection imported Successfully!' }, status: 201
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def sets
    if current_user
      @collection = current_user.collection
      @card_sets = CardSet.where(code: current_user.collection.sets).sort_by(&:release_date).reverse
      render 'api/v1/card_sets/card_sets.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end
end
