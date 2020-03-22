class Api::V1::CardSetsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_set, only: [:show, :cards]
  respond_to :json

  def index
    @card_sets = CardSet.all.order("release_date DESC")
    render json: @card_sets
  end

  def show
    render json:  @card_set
  end

  def cards
  end

  private

    def load_set
      @card_set = CardSet.find(params[:id])
    end
end
