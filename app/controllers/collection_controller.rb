class CollectionController < ApplicationController
    def index
        @collection = current_user.collection.collected_cards
        @collection_cards = current_user.collection.cards
      end
end
