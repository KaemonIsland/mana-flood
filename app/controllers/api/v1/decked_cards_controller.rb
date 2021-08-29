class Api::V1::DeckedCardsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :load_deck, :load_collection, only: [:index, :create, :update, :destroy]
    before_action :load_card, only: [:create, :update, :destroy]
    before_action :load_decked_cards, only: [:update, :destroy]
    respond_to :json

    def index
      if current_user
        @collection = current_user.collection

        @query =@deck.cards.with_color(params[:colors], @deck.cards).ransack(params[:q])
  
        @sorted_cards = @query.result.by_mana_and_name
  
        @cards = Kaminari.paginate_array(@sorted_cards)
        .page(1)
        .per(300)
        
        render 'api/v1/cards/deck.json.jbuilder', status: 200
      else
        render json: { error: 'User must be signed in' }, status: 401
      end
    end
    
    def create
      if in_deck?(@deck, @card)
        render json: { error: 'Card is already in this deck' }, status: 400
      elsif @deck.cards << @card
        @decked_card = @deck.decked_cards.find_by(card_id: @card.id)
        @decked_card.quantity = 1

        if params[:foil]
          @decked_card.foil = 1
        end

        @decked_card.save

        render 'api/v1/card/deck.json.jbuilder', status: 201
      else
        render json: { error: 'Unable to add card to deck' }, status: 400
      end
    end
    
    def update
      if !in_deck?(@deck, @card)
        @deck.cards << @card
        @decked_card = @deck.decked_cards.find_by(card_id: @card.id)
        @decked_card.update(decked_card_params)

        # We don't want a collection to have more foils than owned cards
        if @decked_card.foil > @decked_card.quantity
          @decked_card.foil = @decked_card.quantity
          @decked_card.save
        end

        render 'api/v1/card/deck.json.jbuilder', status: 201
      elsif @decked_card.update(decked_card_params)

        # We don't want a collection to have more foils than owned cards
        if @decked_card.foil > @decked_card.quantity
          @decked_card.foil = @decked_card.quantity
          @decked_card.save
        end

        render 'api/v1/card/deck.json.jbuilder', status: 200
      else
        render json: { error: 'Unable to update card quantity' }, status: 400
      end
    end
    
    def destroy
      if !in_deck?(@deck, @card)
        render json: { error: 'Card not in deck' }, status: 404
      elsif @decked_card.destroy
        render 'api/v1/card/deck.json.jbuilder', status: 200
      else
        render json: { error: 'Unable to remove card from deck' }, status: 400
      end
    end
    
      private

      def load_collection
        return render json: { error: 'User must be signed in' }, status: 401 unless current_user

        @collection = current_user.collection
      end
    
      def load_card
        @card = Card.find(params[:card_id])
      end
    
      def load_deck
        @deck = current_user.decks.find(params[:id])
      end
    
      def load_decked_cards
        @decked_card = @deck.decked_cards.find_by(card_id: @card.id)
      end
  
      def decked_card_params
        params.permit(:quantity, :foil)
      end
  
end