class AddFlavorNameToCards < ActiveRecord::Migration[6.0]
  def change
    add_column :cards, :flavor_name, :string
  end
end
