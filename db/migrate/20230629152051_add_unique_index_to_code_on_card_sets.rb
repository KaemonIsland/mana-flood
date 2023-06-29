class AddUniqueIndexToCodeOnCardSets < ActiveRecord::Migration[6.1]
  def change
    add_index :card_sets, :code, unique: true
  end
end
