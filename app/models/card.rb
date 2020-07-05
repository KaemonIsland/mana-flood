class Card < ApplicationRecord
  belongs_to :card_set, optional: true
  has_many :collected_cards, dependent: :destroy
  has_many :collections, through: :collected_cards
  has_many :decked_cards, dependent: :destroy
  has_many :decks, through: :decked_cards

  validates :uuid, presence: true, uniqueness: { case_sensitive: false }

  # Serialize Objects/Arrays https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html
  serialize :preferences, JSON
  serialize :color_indicator, JSON
  serialize :colors, JSON
  serialize :frame_effects, JSON
  serialize :leadership_skills, JSON
  serialize :legalities, JSON
  serialize :names, JSON
  serialize :other_face_ids, JSON
  serialize :prices, JSON
  serialize :printings, JSON
  serialize :reverse_related, JSON
  serialize :rulings, JSON
  serialize :subtypes, JSON
  serialize :supertypes, JSON
  serialize :variations, JSON

  def collection_quantity(collection_id)
    return 0 unless collection_id

    collected = self.collected_cards.select { |col| col.collection_id === collection_id }

    collected.empty? ? 0 : collected.first.quantity
  end

  def deck_quantity(deck_id)
    return 0 unless deck_id

    decked = self.decked_cards.select { |deck| deck.deck_id === deck_id }

    decked.empty? ? 0 : decked.first.quantity
  end
end
