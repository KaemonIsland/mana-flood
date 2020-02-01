class CreateCardSets < ActiveRecord::Migration[6.0]
  # MTG JSON SET https://mtgjson.com/structures/set/
  def change
    create_table :card_sets do |t|
      t.integer :base_set_size
      t.string :block
      t.string :code
      t.string :code_v3
      t.boolean :is_foreign_only
      t.boolean :is_foil_only
      t.boolean :is_online_only
      t.boolean :is_partial_preview
      t.string :keyrune_code
      t.string :mcm_name
      t.integer :mcm_id
      t.string :mtgo_code
      t.string :name
      t.string :parent_code
      t.string :release_date
      t.integer :tcgplayer_group_id
      t.integer :total_set_size
      t.string :type

      t.timestamps
    end
  end
end
