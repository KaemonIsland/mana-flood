class Card < ApplicationRecord
  belongs_to :card_set, optional: true
end
