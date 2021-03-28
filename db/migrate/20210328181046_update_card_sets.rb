class UpdateCardSets < ActiveRecord::Migration[6.0]
  def change
    remove_column :card_sets, :mcm_name
    remove_column :card_sets, :mcm_id

    add_column :card_sets, :index, :integer, unique: true

    add_index :card_sets, :index, unique: true
  end
end
