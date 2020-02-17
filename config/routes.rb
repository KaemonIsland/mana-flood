Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Get user collection, and view card sets
      get 'collection', to: 'collected_cards#index'
      get 'card_sets', to: 'card_sets#index'
      get 'card_set/:id', to: 'card_sets#show'

      # Crud operations for users card collection
      post 'add_card/:id', to: 'collected_cards#create', as: 'add_card'
      put 'add_card/:id', to: 'collected_cards#update', as: 'update_card'
      delete 'remove_card/:id', to: 'collected_cards#destroy', as: 'remove_card'
    end
  end

  get 'cards', to: 'cards#index'

  get 'sets', to: 'card_sets#index'
  get 'sets/:id', to: 'card_sets#show'

  post 'update_cards', to: 'cards#update_card_db'
  post 'update_card_sets', to: 'card_sets#update_card_set_db'

  devise_for :users, 
    path: '', 
    controllers: { registrations: 'users/registrations' },
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  root "pages#home"
end
