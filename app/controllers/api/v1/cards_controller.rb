class Api::V1::CardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_card, :set_variations, only: [:collection, :deck]
  before_action :load_collection, only: [:collection, :search_with_collection, :search_with_deck, :deck]
  before_action :load_query, only: [:search_with_collection, :search_with_deck]
  respond_to :json

  def collection
    if current_user
      render 'api/v1/card/collection.json.jbuilder', status: 200
    else
    render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def deck
    if current_user
      @deck = Deck.find(params[:deck_id])
      render 'api/v1/card/deck.json.jbuilder', status: 200
    else
   render json: { error: 'User must be signed in' }, status: 401
    end
  end

  def search_with_collection
    @cards = Kaminari.paginate_array(@sorted_cards)
    .page(params[:page])
    .per(params[:per_page] || 30)

    render 'api/v1/cards/cards.json.jbuilder', status: 200
  end

  def search_with_deck
    @deck = Deck.find(params[:deck_id])

    @cards = Kaminari.paginate_array(@sorted_cards)
    .page(params[:page])
    .per(params[:per_page] || 30)

    render 'api/v1/cards/cards.json.jbuilder', status: 200
  end

  private

  def load_query
    if params[:q][:collection_only] && @collection
      @query = @collection.cards.with_color(params[:colors], Card).order("original_release_date ASC").ransack(params[:q])
    else
      @query = Card.with_color(params[:colors], Card).order("original_release_date ASC").ransack(params[:q])
    end

    @sorted_cards = Card.sort_by_color(@query.result.by_mana_and_name.limit(50000))

    @stats = Card.card_stats(@sorted_cards)
  end

  def load_card
    @card = Card.find(params[:id])
  end

  def load_collection
    @collection = current_user.collection
  end

  def set_variations
    @variations = []

    unless @card.variations.blank?
      @cardVariations = @card.variations&.split(',')

      @cardVariations.each do |variation|
        variant = Card.find_by({ uuid: variation })

        @variations << { id: variant.id, uuid: variation, scryfall_id: variant.scryfall_id }
      end
    end
  end
end
