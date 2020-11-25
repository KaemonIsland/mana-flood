class Ruling < ApplicationRecord
  validates :date, presence: true
  validates :text, presence: true
  validates :uuid, presence: true
end
