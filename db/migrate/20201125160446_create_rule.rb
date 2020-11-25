class CreateRule < ActiveRecord::Migration[6.0]
  def change
    create_table :rulings do |t|
      t.date :date
      t.string :text
      t.string :uuid
      t.integer :mtgjson_id
    end
    add_index :rulings, :mtgjson_id, unique: true
    
  end
end
