Rails.application.routes.draw do
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
