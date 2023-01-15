class DeckedCard < ApplicationRecord
  belongs_to :card
  belongs_to :deck, touch: true

  before_save :set_quantity
  before_save :set_foil
  before_save :set_default_category

  after_save :remove_empty_quantity

  validates :deck_id, uniqueness: { scope: :card_id }

  private

  def set_quantity
    self.quantity ||= 1
  end

  def set_foil
    self.foil ||= 0
  end

  def set_default_category
    if categories.empty?
      card_type = card.card_types.first
      self.categories ||= [card_type]
    else
      self.categories
    end
  end

  def remove_empty_quantity
    quantity.zero? && destroy
  end
end