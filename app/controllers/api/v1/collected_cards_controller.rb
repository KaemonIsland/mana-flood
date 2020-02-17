class Api::V1::CollectedCardsController < ApplicationController
  respond_to :json

  def index
    if !current_user
      @collection = current_user.collection.collected_cards
      @collection_cards = current_user.collection.cards
      render json: { collection: @collection, collection_cards: @collection_cards }
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def add_card
  end

  def remove_card
  end
end
