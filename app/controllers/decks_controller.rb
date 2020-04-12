class DecksController < ApplicationController

    def index
        if current_user && user_signed_in?
            @decks = current_user.decks
        else
            redirect_to root_path
        end
    end
end
