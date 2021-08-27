class AddFoilToCollectedCards < ActiveRecord::Migration[6.1]
  def change
    add_column :collected_cards, :foil, :integer
  end
end
