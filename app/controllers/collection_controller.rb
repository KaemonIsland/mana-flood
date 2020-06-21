class CollectionController < ApplicationController
  def index
  end

  def show
    @cardSet = CardSet.find(params[:id])
  end
end
