class Api::V1::CardSetsController < ApplicationController
  respond_to :json

  def index
    @card_sets = CardSet.all.order("release_date DESC")
    render json: @card_sets
  end

  def show
    @card_set = CardSet.find(params[:id])
    @cards = @card_set.cards
    render json: { card_set: @card_set, cards: @cards }
  end
end
