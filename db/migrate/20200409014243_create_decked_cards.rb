class CreateDeckedCards < ActiveRecord::Migration[6.0]
  def change
    create_table :decked_cards do |t|
      t.belongs_to :deck
      t.belongs_to :card
      t.integer :quantity

      t.timestamps
    end
  end
end
