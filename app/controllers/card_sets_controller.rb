class CardSetsController < ApplicationController
  respond_to :json

  def index
    @card_sets = CardSet.all.order("release_date DESC")
  end

  def show
    @card_set = CardSet.find(params[:id])
  end
end
