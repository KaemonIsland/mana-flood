class CardSetCard < ApplicationRecord
  belongs_to :card
  belongs_to :card_set

  # Prevents a card_set from having multiple instances of a single card
  validates :card_id, uniqueness: { scope: :card_set_id }
end
