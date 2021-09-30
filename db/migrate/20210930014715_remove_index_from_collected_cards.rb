class RemoveIndexFromCollectedCards < ActiveRecord::Migration[6.1]
  def change
    remove_index :collected_cards, column: :card_id
  end
end
