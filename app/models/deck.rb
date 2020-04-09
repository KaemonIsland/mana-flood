class Deck < ApplicationRecord
    belongs_to :user
    has_many :decked_cards
    has_many :cards, -> { distinct }, through: :decked_cards
end
