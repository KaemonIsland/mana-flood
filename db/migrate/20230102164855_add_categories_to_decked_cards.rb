class AddCategoriesToDeckedCards < ActiveRecord::Migration[6.1]
  def change
    add_column :decked_cards, :categories, :string, array: true, default: []
  end
end
