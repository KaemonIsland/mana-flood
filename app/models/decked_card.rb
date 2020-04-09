class DeckedCard < ApplicationRecord
    belongs_to :card
    belongs_to :deck, touch: true
  
    before_save :set_quantity
  
    validates :deck_id, uniqueness: { scope: :card_id }
  
    private
  
    def set_quantity
      self.quantity ||= 1
    end
end