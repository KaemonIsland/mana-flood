class CardsController < ApplicationController
  before_action :can_update, only: [:update_card_db]
  skip_before_action :verify_authenticity_token, only: [:update_card_db]
  respond_to :json

  def index
    @cards = Card.all
  end

  def update_card_db
    render body: nil, status: 200
    @cards = params[:cards]
    Card.upsert_all(@cards, unique_by: 'uuid')
  end

  private

  def can_update
    if !user_signed_in? || !current_user.admin?
      render body: nil, status: 401
      return nil
    end
  end
end
