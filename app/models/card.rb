class Card < ApplicationRecord
  belongs_to :card_set, optional: true
  has_many :collected_cards
  has_many :collections, through: :collected_cards, optional: true
end
