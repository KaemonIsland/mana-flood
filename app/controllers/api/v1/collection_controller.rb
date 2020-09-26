class Api::V1::CollectionController < ApplicationController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def export
    if current_user
      @collection = current_user.collection
      @cards = @collection.cards

      render 'api/v1/cards/export.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def import
    if current_user
      @collection = current_user.collection

      permitted = params.permit(cards: [:uuid, :quantity])

      @cards = permitted[:cards]

      @not_found = []

      @cards.each do |card|
        imported = Card.find_by(uuid: card[:uuid])

        # Skip card if not found
        if !imported
          @not_found << card

          next
        end

        # Updates card quantity if already in collection
        if in_collection?(@collection, imported)
          @collected_card = @collection.collected_cards.find_by(card_id: imported.id)

          updated_quantity = @collected_card.quantity + card[:quantity].to_i

          @collected_card.update(quantity: updated_quantity)
        else
          # Add card to collection
          @collection.collected_cards.create!({ card_id: imported.id, quantity: card[:quantity].to_i })

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
      @card_sets = CardSet.find(current_user.collection.sets).sort_by(&:release_date).reverse
      render 'api/v1/card_sets/card_sets.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end
end
