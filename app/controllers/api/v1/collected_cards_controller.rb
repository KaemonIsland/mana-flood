class Api::V1::CollectedCardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_card, :load_collection, only: [:collection, :create, :update, :destroy]
  before_action :load_collected_card, only: [:update, :destroy]
  respond_to :json

  def collection
    if current_user
      @colors = {
        W: [],
        U: [],
        B: [],
        R: [],
        G: [],
        M: [],
        C: [],
      }

      # Single or specific Multi color
      #  .where(color_identity: ["W", "U"])

      # All multi searches
      #  .where('array_length(color_identity, 1) >= 2')

      # Colorless search
      #  .where(color_identity, [])
      @query = Card
        .where(card_set_id: params[:id].to_i)
        .ransack(params[:q])

      @query
        .result
        .order(converted_mana_cost: :asc, name: :asc)
        .each{ |card| 
          colors = card.color_identity

          if colors.empty?
            @colors[:C] << card
          elsif colors.length === 2
            @colors[:M] << card
          else
            @colors[colors[0].to_sym] << card
          end
        }

        @cards = Kaminari.paginate_array([].concat(
          @colors[:W],
          @colors[:U],
          @colors[:B],
          @colors[:R],
          @colors[:G],
          @colors[:M],
          @colors[:C]))
        .page(params[:page])
        .per(params[:per_page] || 30)

      render 'api/v1/cards/collection.json.jbuilder', status: 200
    else
      render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def deck
    if current_user
      @collection = current_user.collection
      @cards = @collection.cards
      @deck = current_user.decks.find(params[:id])
      render 'api/v1/cards/deck.json.jbuilder', status: 200
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
      render json: { error: 'Card not in collection' }, status: 404
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
