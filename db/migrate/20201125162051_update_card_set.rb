class UpdateCardSet < ActiveRecord::Migration[6.0]
  def up
    remove_column :card_sets, :code_v3
    add_column :card_sets, :is_non_foil_only, :boolean, default: false
  end

  def down
    add_column :card_sets, :code_v3, :string
    remove_column :card_sets, :is_non_foil_only
  end
end
