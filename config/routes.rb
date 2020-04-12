Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # view card sets
      get 'sets', to: 'card_sets#index'
      get 'set/:id', to: 'card_sets#show'
      get 'set_cards/:id', to: 'card_sets#cards'
      
      # Decks
      resources :decks, except: [:new, :edit]
      
      # Crud operations for users decked_cards
      post 'add_decked_card/:id', to: 'decked_cards#create'
      put 'add_decked_card/:id', to: 'decked_cards#update'
      delete 'remove_decked_card/:id', to: 'decked_cards#destroy'
      
      # Crud operations for users card collection
      get 'collection', to: 'collected_cards#index'
      post 'add_card/:id', to: 'collected_cards#create', as: 'add_card'
      put 'add_card/:id', to: 'collected_cards#update', as: 'update_card'
      delete 'remove_card/:id', to: 'collected_cards#destroy', as: 'remove_card'
    end
  end

  get 'decks', to: 'decks#index'
  get 'sets', to: 'card_sets#index'
  get 'sets/:id', to: 'card_sets#show'

  post 'update_cards', to: 'cards#update_card_db'
  post 'update_card_sets', to: 'card_sets#update_card_set_db'

  get 'collection', to: 'collection#index'

  devise_for :users, 
    path: '', 
    controllers: { registrations: 'users/registrations' },
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  root "pages#home"
end
