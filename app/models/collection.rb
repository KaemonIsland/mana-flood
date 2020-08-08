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
  def sets
    set_arr = []

    self.cards.each { |card| set_arr << card.card_set_id }

    set_arr.uniq
  end

  # Returns number of unique cards in set
  def sets_unique(card_set_id)
    self.cards.filter{ |card| card.card_set_id === card_set_id }.count
  end

  ############## SCOPES #################
  def with_set_cards (set_id) 
    self.cards.where(card_set_id: set_id)
  end
end
