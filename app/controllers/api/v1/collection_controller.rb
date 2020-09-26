class Api::V1::CollectionController < ApplicationController
  respond_to :json

  def export_collection
    if current_user
      @collection = current_user.collection
      @cards = @collection.cards

      render 'api/v1/cards/export.json.jbuilder', status: 200
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
