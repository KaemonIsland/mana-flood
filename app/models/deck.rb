class Deck < ApplicationRecord
    belongs_to :user
    has_many :decked_cards, dependent: :destroy
    has_many :cards, -> { distinct }, through: :decked_cards

    validates :name, presence: true
end
