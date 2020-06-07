class Api::V1::CardSetsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_set, only: [:show, :collection, :with_deck]
  respond_to :json

  def index
    @card_sets = CardSet.all.order("release_date DESC")
    render json: @card_sets
  end

  def show
    render json:  @card_set
  end

  def collection
    if current_user
      @collection = current_user.collection
      @cards = @card_set.cards
      render 'api/v1/cards/collection.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def deck
    if current_user
      @collection = current_user.collection
      @deck = current_user.decks.find(params[:deck_id])
      @cards = @card_set.cards
      render 'api/v1/cards/deck.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  private

    def load_set
      @card_set = CardSet.find(params[:id])
    end
end
