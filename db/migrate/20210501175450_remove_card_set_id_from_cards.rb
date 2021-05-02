class RemoveCardSetIdFromCards < ActiveRecord::Migration[6.0]
  def change
    remove_column :cards, :card_set_id
  end
end
