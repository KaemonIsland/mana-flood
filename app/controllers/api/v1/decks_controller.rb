class Api::V1::DecksController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :load_deck, only: [:update, :destroy]
    before_action :check_current_user
    respond_to :json

    def index
        if current_user
            @decks = current_user.decks
            render json: @decks
        else
            render json: { error: 'User must be signed in' }, status: 401
        end
    end

    def create
        
    @deck = current_user.decks.create(deck_params)

    authorize! :create, @deck
        if @deck.save
            render json: @deck
        else
            render json: { error: 'Unable to create deck' }, status: 422
        end
    end

    def update
        authorize! :update, @deck
        if @deck.update(deck_params)
            render json: @deck
        else
            render json: { error: 'Unable to update deck' }, status: 422
        end
    end

    def destroy
        authorize! :destroy, @deck
        if @deck.destroy
            render json: @deck
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
  