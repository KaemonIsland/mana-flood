class Api::V1::CollectedCardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_card, only: [:create, :update, :destroy]
  before_action :load_collection, only: [:collection, :deck, :create, :update, :destroy]
  before_action :load_set, only: [:collection, :deck]
  before_action :load_collected_card, only: [:update, :destroy]
  respond_to :json

  def index
    if current_user
      @collection = current_user.collection

      @query = @collection.cards.with_color(params[:colors], @collection.cards).ransack(params[:q])

      @sorted_cards = Card.sort_by_color(@query.result.by_mana_and_name)

      @stats = Card.card_stats(@collection.cards)

      @cards = Kaminari.paginate_array(@sorted_cards)
      .page(params[:page])
      .per(params[:per_page] || 30)

      render 'api/v1/cards/cards.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def collection
    if current_user
      collection_set_cards = @collection.with_set_cards(@set.code)

      if params[:colors].present?
        @query = collection_set_cards.with_color(params[:colors], collection_set_cards).ransack(params[:q])
      else
        @query = collection_set_cards.ransack(params[:q])
      end

      @sorted_cards = Card.sort_by_color(@query.result.by_mana_and_name)

      @stats = Card.card_stats(collection_set_cards)

        @cards = Kaminari.paginate_array(@sorted_cards)
        .page(params[:page])
        .per(params[:per_page] || 30)

      render 'api/v1/cards/cards.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def deck
    if current_user
      collection_set_cards = @collection.with_set_cards(@set.code)

      if params[:colors].present?
        @query = collection_set_cards.with_color(params[:colors], collection_set_cards).ransack(params[:q])
      else
        @query = collection_set_cards.ransack(params[:q])
      end

      @sorted_cards = Card.sort_by_color(@query.result.by_mana_and_name)

      @stats = Card.card_stats(collection_set_cards)

      @cards = Kaminari.paginate_array(@sorted_cards)
        .page(params[:page])
        .per(params[:per_page] || 30)

      
      @deck = current_user.decks.find(params[:deck_id])
      render 'api/v1/cards/cards.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end
  
  def create
    if in_collection?(@collection, @card)
      render json: { error: 'Card already exists in collection' }, status: 400
    elsif @collection.cards << @card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
      @collected_card.quantity = 1
      @collected_card.save

      render 'api/v1/card/collection.json.jbuilder', status: 201
    else
      render json: { error: 'Unable to add card to collection' }, status: 400
    end
  end

  def update
    if !in_collection?(@collection, @card)
      @collection.cards << @card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
      @collected_card.update(collected_card_params)
      @collected_card.save

      render 'api/v1/card/collection.json.jbuilder', status: 201
    elsif @collected_card.update(collected_card_params)
      render 'api/v1/card/collection.json.jbuilder', status: 200
    else
      render json: { error: 'Unable to update card quantity' }, status: 400
    end
  end

  def destroy
    if !in_collection?(@collection, @card)
      render json: { error: 'Card not in collection' }, status: 404
    elsif @collected_card.destroy
      render 'api/v1/card/collection.json.jbuilder', status: 200
    else
      render json: { error: 'Unable to remove card from collection' }, status: 400
    end
  end
  
    private
  
    def load_card
      @card = Card.find(params[:id])
    end

    def load_set
      @set = CardSet.find(params[:id])
    end
  
    def load_collection
      @collection = current_user.collection
    end
  
    def load_collected_card
      @collected_card = @collection.collected_cards.find_by(card_id: @card.id)
    end

    def collected_card_params
      params.permit(:quantity)
    end
  end
