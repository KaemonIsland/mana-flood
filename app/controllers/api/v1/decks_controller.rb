class Api::V1::DecksController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :load_deck, only: [:show, :update, :destroy]
    before_action :check_current_user
    respond_to :json

    def index
        if current_user
            @decks = current_user.decks.order(updated_at: :desc)
            render 'api/v1/decks/decks.json.jbuilder', status: 200
        else
            render json: { error: 'User must be signed in' }, status: 401
        end
    end

    def show
        if current_user
            render 'api/v1/deck/deck.json.jbuilder', status: 200
        else
            render json: { error: 'User must be signed in' }, status: 401
        end
    end

    def create
        @deck = current_user.decks.create(deck_params)

        if @deck.save
            render 'api/v1/deck/deck.json.jbuilder', status: 200
        else
            render json: { error: 'Unable to create deck' }, status: 422
        end
    end

    def update
        if @deck.update(deck_params)
            render 'api/v1/deck/deck.json.jbuilder', status: 200
        else
            render json: { error: 'Unable to update deck' }, status: 422
        end
    end

    def destroy
        if @deck.destroy
            render 'api/v1/deck/deck.json.jbuilder', status: 200
        else
            render json: { error: 'Unable to update deck' }, status: 422
        end
    end

    private

    def check_current_user
        return render json: { error: 'User must be signed in' }, status: 401 unless current_user
    end

    def deck_params
        params.permit(:name, :description, :format)
    end

    def load_deck
        @deck = current_user.decks.find(params[:id])
    end
  
end
  