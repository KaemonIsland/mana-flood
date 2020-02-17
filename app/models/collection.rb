class Collection < ApplicationRecord
  has_many :collected_cards
  has_many :cards, -> { distinct }, through: :collected_cards
end
