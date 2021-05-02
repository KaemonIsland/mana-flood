class AddCardSetCardsAssociation < ActiveRecord::Migration[6.0]
  def change
    create_table :card_set_cards do |t|
      t.belongs_to :card
      t.belongs_to :card_set

      t.timestamps
    end
  end
end
