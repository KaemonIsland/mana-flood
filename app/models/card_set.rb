require 'json'

class CardSet < ApplicationRecord
  has_many :cards, dependent: :nullify
  has_many :collections, through: :collected_cards

  validates :mcm_id, presence: true, uniqueness: { case_sensitive: false }
end
