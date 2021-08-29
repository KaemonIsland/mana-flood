class AddFoilToDeckedCards < ActiveRecord::Migration[6.1]
  def change
    add_column :decked_cards, :foil, :integer
  end
end
