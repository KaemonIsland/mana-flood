class CollectedCard < ApplicationRecord
  belongs_to :card
  belongs_to :collection

  before_save :set_quantity

  validates :collection_id, uniqueness: { scope: :card_id }

  private

  def set_quantity
    self.quantity ||= 1
  end
end
