Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # view card sets
      get 'sets', to: 'card_sets#index'
      get 'set/:id', to: 'card_sets#show'
      get 'set_cards/:id', to: 'card_sets#cards'
      
      # Crud operations for users decked_cards
      resources :decks, except: [:new, :edit]
      get 'decked_cards/:id', to: 'decked_cards#show'
      post 'add_decked_card/:id/:card_id', to: 'decked_cards#create'
      put 'add_decked_card/:id/:card_id', to: 'decked_cards#update'
      delete 'remove_decked_card/:id/:card_id', to: 'decked_cards#destroy'
      
      # Crud operations for users card collection
      get 'collection', to: 'collected_cards#index'
      post 'add_card/:id', to: 'collected_cards#create', as: 'add_card'
      put 'add_card/:id', to: 'collected_cards#update', as: 'update_card'
      delete 'remove_card/:id', to: 'collected_cards#destroy', as: 'remove_card'
    end
  end

  # Deck Routes
  get 'decks', to: 'decks#index'
  get 'deck/:id', to: 'decks#show'

  # Set Routes
  get 'sets', to: 'card_sets#index'
  get 'sets/:id', to: 'card_sets#show'

  # Collection Routes
  get 'collection', to: 'collection#index'

  # Routes to update cards database
  post 'update_cards', to: 'cards#update_card_db'
  post 'update_card_sets', to: 'card_sets#update_card_set_db'


  # Revised routes for auth
  devise_for :users, 
    path: '', 
    controllers: { registrations: 'users/registrations' },
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  root "pages#home"
end
