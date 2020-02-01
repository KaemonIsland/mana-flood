class CreateCollections < ActiveRecord::Migration[6.0]
  def change
    create_table :collections do |t|
      t.belongs_to :user, foreign_id: 'user_id'

      t.timestamps
    end
  end
end
