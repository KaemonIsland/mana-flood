class Api::V1::CollectedCardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_card, :load_collection, only: [:create, :update, :destroy]
  before_action :load_collected_card, only: [:update, :destroy]
  respond_to :json

  def index
    if !current_user
      @collection = User.first.collection.collected_cards
      @collection_cards = User.first.collection.cards
      render json: { collection: @collection, collection_cards: @collection_cards }
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end
  
    def create
      if @collection.cards.find(@card.id)
        render json: { error: 'Unable to add card to collection' }, status: 400
      elsif @collection.cards << @card
        @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
        @collected_card.quantity = 1
        @collected_card.save

        render json: { collection: @collection.collected_cards, collection_cards: @collection.cards }, status: 201
      else
        render json: { error: 'Unable to add card to collection' }, status: 400
      end
    end
  
    def update
      if @collected_card.update(collected_card_params)
        render json: { collection: @collection.collected_cards, collection_cards: @collection.cards }, status: 200
      else
        render json: { error: 'Unable to update card quantity' }, status: 400
      end
    end
  
    def destroy
      if !@collected_card 
        render json: { error: 'Card not found' }, status: 404
      elsif @collected_card.destroy
        render json: { collection: @collection.collected_cards, collection_cards: @collection.cards }, status: 200
      else
        render json: { error: 'Unable to remove card from collection' }, status: 400
      end
    end
  
    private
  
    def load_card
      @card = Card.find(params[:id])
    end
  
    def load_collection
      @collection = User.first.collection
    end
  
    def load_collected_card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
    end

    def collected_card_params
      params.permit(:quantity)
    end
  end
