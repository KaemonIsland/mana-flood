class Api::V1::CardsController < ApplicationController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def show
    @card = Card.find(params[:id])
    @collection = current_user.collection

    @variations = []

    if !@card.variations.nil?
      @card.variations.each do |variation|
        variant = Card.find_by({ uuid: variation })

        @variations << { id: variant.id, uuid: variation, scryfall_id: variant.scryfall_id }
      end
    end

    render 'api/v1/card/in_deck.json.jbuilder', status: 200
  end
end
