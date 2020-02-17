class CollectedCardsController < ApplicationController
  before_action :load_card, :load_collection, only: [:create, :update, :destroy]
  before_action :load_collected_card, only: [:update, :destroy]


  def index
    @collection = current_user.collection.collected_cards
    @collection_cards = current_user.collection.cards
  end

  def create
    if @collection.cards << @card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
      @collected_card.quantity = 1
      @collected_card.save
    end
  end

  def update
    if @collected_card && @collected_card.quantity
      @collected_card.quantity += 1
      @collected_card.save!
    end
  end

  def destroy
  end

  private

  def load_card
    @card = Card.find(params[:id])
  end

  def load_collection
    @collection = current_user.collection
  end

  def load_collected_card
    @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
  end
end
