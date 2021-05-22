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

  # Lists each card set id
  def sets
    cards.flat_map(&:card_set_ids).uniq
  end

  # Returns number of unique cards in set
  def sets_unique(card_set_id)
    cards.filter{ |card| card.card_set_ids.include? card_set_id }.count
  end

  ############## SCOPES #################
  def with_set_cards (set_id)
    # cards.filter { |card| card.card_set_ids.include? set_id }
    cards.joins(:card_set_cards).where(card_set_cards: { card_set_id: set_id })
  end
end