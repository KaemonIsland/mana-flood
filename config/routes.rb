Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # view card sets
      get 'sets', to: 'card_sets#index'
      get 'set/:id', to: 'card_sets#show'
      get 'sets/:id/collection', to: 'card_sets#collection'
      get 'sets/:id/deck/:deck_id', to: 'card_sets#with_deck'
      
      # Crud operations for users decked_cards
      resources :decks, except: [:new, :edit]
      get 'decked_cards/:id/collection', to: 'decked_cards#collection'
      get 'decked_cards/:id', to: 'decked_cards#with_deck'
      post 'add_decked_card/:id/:card_id', to: 'decked_cards#create'
      put 'add_decked_card/:id/:card_id', to: 'decked_cards#update'
      delete 'remove_decked_card/:id/:card_id', to: 'decked_cards#destroy'
      
      # Crud operations for users card collection
      get 'collection', to: 'collected_cards#collection'
      get 'collection/deck/:id', to: 'collected_cards#with_deck'
      post 'add_card/:id', to: 'collected_cards#create', as: 'add_card'
      put 'add_card/:id', to: 'collected_cards#update', as: 'update_card'
      delete 'remove_card/:id', to: 'collected_cards#destroy', as: 'remove_card'

      # Methods for single cards
      get 'card/:id', to: 'cards#show'
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

  # Methods for single cards
  get 'card/:id', to: 'cards#show'


  # Revised routes for auth
  devise_for :users, 
    path: '', 
    controllers: { registrations: 'users/registrations' },
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  root "pages#home"
end
