class CreateDeckTable < ActiveRecord::Migration[6.0]
  def change
    create_table :decks do |t|
      t.belongs_to :user
      t.string :name
      t.string :description
      t.integer :type

      t.timestamps
    end
  end
end
