class CardSet < ApplicationRecord
  has_many :cards
  has_many :collections, through: :collected_cards
end
