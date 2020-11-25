class CreateLegality < ActiveRecord::Migration[6.0]
  def change
    create_table :legalities do |t|
      t.string :format
      t.string :status
      t.string :uuid

      t.timestamps
    end
  end
end
