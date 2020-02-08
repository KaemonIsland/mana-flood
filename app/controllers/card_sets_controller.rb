class CardSetsController < ApplicationController
  before_action :can_update, only: [:update_card_set_db]
  skip_before_action :verify_authenticity_token, only: [:update_card_set_db]
  respond_to :json

  def index
    @card_sets = CardSet.all.order("release_date DESC")
  end

  def show
    @card_set = CardSet.find(params[:id])
  end

  def update_card_set_db
    @card_sets = params[:card_sets]
    @cards = params[:cards]
    @card_uuids = params[:card_uuids]
    # Insterts/updates CardSet database
    CardSet.upsert_all(@card_sets, unique_by: 'mcm_id')

    Card.upsert_all(@cards, unique_by: 'uuid')

    # Add cards to sets card_obj = { mcm_id: 00, uuids: [ '123', '456', '789' ] }
    @card_uuids.each do |card_obj|
      @set = CardSet.find_by(mcm_id: card_obj[:mcm_id])
      card_obj[:uuids].each do |uuid|
        @card = Card.find_by(uuid: uuid)
        @set.cards << @card if @card
      end
    end
    render body: nil, status: 200
  end

  private

  def can_update
    if !user_signed_in? || !current_user.admin?
      render body: nil, status: 401
      return nil
    end
  end
end
