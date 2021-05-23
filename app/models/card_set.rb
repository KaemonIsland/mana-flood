require 'json'

class CardSet < ApplicationRecord
  has_many :card_set_cards
  has_many :cards, through: :card_set_cards

  validates :mcm_id, presence: true, uniqueness: { case_sensitive: false }
end
