class CollectedCard < ApplicationRecord
  belongs_to :card
  belongs_to :collection, touch: true

  before_save :set_quantity
  before_save :set_foil

  validates :collection_id, uniqueness: { scope: :card_id }

  private

  def set_quantity
    self.quantity ||= 1
  end

  def set_foil
    self.foil ||= 0
  end
end
