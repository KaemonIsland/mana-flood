class AddArrayTypeToCard < ActiveRecord::Migration[6.0]
  def change
    remove_column :cards, :color_identity
    add_column :cards, :color_identity, :string, array: true, default: []
  end
end
