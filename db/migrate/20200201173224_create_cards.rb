class CreateCards < ActiveRecord::Migration[6.0]
  # MTG JSON Card object https://mtgjson.com/structures/card/
  def change
    create_table :cards do |t|
      t.string :artist
      t.string :border_color
      t.string :color_identity
      t.string :color_indicator
      t.string :colors
      t.float :converted_mana_cost
      t.integer :edhrec_rank
      t.float :face_converted_mana_cost
      t.string :flavor_text
      t.boolean :has_foil
      t.boolean :has_non_foil
      t.boolean :is_alternative
      t.boolean :is_arena
      t.boolean :is_full_art
      t.boolean :is_mtgo
      t.boolean :is_online_only
      t.boolean :is_oversized
      t.boolean :is_paper
      t.boolean :is_promo
      t.boolean :is_reprint
      t.boolean :is_reserved
      t.boolean :is_starter
      t.boolean :is_story_spotlight
      t.boolean :is_textless
      t.string :layout
      t.string :leadership_skills
      t.string :legalities
      t.string :loyalty
      t.string :mana_cost
      t.integer :mcm_id
      t.integer :mcm_meta_id
      t.integer :mtg_arena_id
      t.integer :mtgo_foil_id
      t.integer :mtgo_id
      t.integer :multiverse_id
      t.string :name
      t.string :names
      t.string :number
      t.string :original_text
      t.string :original_type
      t.string :other_face_ids
      t.string :power
      t.string :prices
      t.string :printings
      t.string :rarity
      t.string :reverse_related
      t.string :rulings
      t.string :scryfall_id
      t.string :scryfall_oracle_id
      t.string :scryfall_illustration_id
      t.string :side
      t.string :subtypes
      t.string :supertypes
      t.integer :tcgplayer_product_id
      t.string :text
      t.string :toughness
      t.string :card_type
      t.string :card_types
      t.string :uuid
      t.string :variations
      t.string :watermark

      t.belongs_to :card_set, foreign_key: true
    end

    add_index :cards, :uuid, unique: true
  end
end
