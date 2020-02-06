# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  after_action :create_collection, only: :create
  
  private

    def create_collection
      if @user
        @collection = Collection.create!()
        @user.collection = @collection
      end
    end
end
