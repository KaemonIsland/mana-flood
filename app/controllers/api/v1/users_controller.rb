class Api::V1::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def show
    if user_signed_in?
      render json: { user: current_user }
    else
      render json: { user: false }
    end
  end
end
