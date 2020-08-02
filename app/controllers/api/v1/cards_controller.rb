class Api::V1::CardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_card, :load_collection, :set_variations, only: [:collection, :deck]
  respond_to :json

  def collection
    if current_user
      render 'api/v1/card/collection.json.jbuilder', status: 200
    else
    render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def deck
    if current_user
      @deck = Deck.find(params[:deck_id])
      render 'api/v1/card/deck.json.jbuilder', status: 200
    else
   render json: { error: 'User must be signed in' }, status: 401
  end
end

  private

  def load_card
    @card = Card.find(params[:id])
  end

  def load_collection
    @collection = current_user.collection
  end

  def set_variations
    @variations = []

    if !@card.variations.nil?
      @card.variations.each do |variation|
        variant = Card.find_by({ uuid: variation })

        @variations << { id: variant.id, uuid: variation, scryfall_id: variant.scryfall_id }
      end
    end
  end
end