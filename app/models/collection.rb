class Collection < ApplicationRecord
  belongs_to :user
  has_many :collected_cards, dependent: :destroy
  has_many :cards, -> { distinct }, through: :collected_cards

  # Lists all unique card within collection
  def unique
    self.cards.count
  end

  # Lists total cards in collection
  def total
    total = 0

    self.collected_cards.each { |card| total = total + card.quantity }

    total
  end

  # Lists each card set id
  def collected_sets
    set_arr = []

    self.cards.each { |card| set_arr << card.card_set_id }

    set_arr.uniq
  end
end
