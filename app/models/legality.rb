class Legality < ApplicationRecord
  validates :format, presence: true
  validates :status, presence: true
  validates :uuid, presence: true
end
