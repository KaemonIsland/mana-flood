class CardSetsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_card_set_db]
  respond_to :json

  def index
    @card_sets = CardSet.all
  end

  def update_card_set_db
    if !user_signed_in? || !current_user.admin?
      render body: nil, status: 401
      return nil
    end

    render body: nil, status: 200
    @card_sets = params[:card_sets]
    @card_uuids = params[:card_uuids]
    # Insterts/updates CardSet database
    CardSet.upsert_all(@card_sets, unique_by: 'mcm_id')

    # Add cards to sets card_obj = { mcm_id: 00, uuids: [ '123', '456', '789' ] }
    @card_uuids.each do |card_obj|
      @set = CardSet.find_by(mcm_id: card_obj[:mcm_id])
      card_obj[:uuids].each do |uuid|
        @card = Card.find_by(uuid: uuid)
        @set.cards << @card if @card
      end
    end
  end
end
