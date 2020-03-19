class Card < ApplicationRecord
  belongs_to :card_set, optional: true
  has_many :collected_cards, dependent: :destroy
  has_many :collections, through: :collected_cards

  validates :uuid, presence: true, uniqueness: { case_sensitive: false }

  # Serialize Objects/Arrays https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html
  serialize :preferences, JSON
  serialize :color_identity, JSON
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
end
