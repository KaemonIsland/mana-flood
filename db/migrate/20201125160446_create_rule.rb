class CreateRule < ActiveRecord::Migration[6.0]
  def change
    create_table :rulings do |t|
      t.date :date
      t.string :text
      t.string :uuid

      t.timestamps
    end
  end
end
