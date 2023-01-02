class CreateCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.boolean :included_in_deck, default: true
      t.boolean :included_in_price, default: true

      t.timestamps
    end
  end
end
