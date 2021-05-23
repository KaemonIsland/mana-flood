class Collection < ApplicationRecord
  belongs_to :user
  has_many :collected_cards, dependent: :destroy
  has_many :cards, -> { distinct }, through: :collected_cards

  # Lists all unique card within collection
  def unique
    cards.count
  end

  # Lists total cards in collection
  def total
    total = 0

    collected_cards.each { |card| total = total + card.quantity }

    total
  end

  # Lists each card set code
  def sets
    cards.map(&:set_code).uniq
  end

  # Returns number of unique cards collected in set
  def sets_unique(card_set_code)
    cards.filter{ |card| card.set_code == card_set_code }.count
  end

  ############## SCOPES #################
  def with_set_cards (set_code)
    cards.where(set_code: set_code)
  end
end