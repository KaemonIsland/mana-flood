class CollectedCard < ApplicationRecord
  belongs_to :card
  belongs_to :collection, touch: true

  before_save :set_quantity
  before_save :set_foil

  after_save :remove_empty_quantity

  validates :collection_id, uniqueness: { scope: :card_id }

  private

  def set_quantity
    self.quantity ||= 1
  end

  def set_foil
    self.foil ||= 0
  end

  def remove_empty_quantity
    if quantity == 0
      self.destroy
    end
  end
end
