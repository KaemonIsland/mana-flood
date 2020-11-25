class CreateLegality < ActiveRecord::Migration[6.0]
  def change
    create_table :legalities do |t|
      t.string :format
      t.string :status
      t.string :uuid
      t.integer :mtgjson_id
    end

    add_index :legalities, :mtgjson_id, unique: true
  end
end
