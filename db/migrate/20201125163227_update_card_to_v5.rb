class UpdateCardToV5 < ActiveRecord::Migration[6.0]
  # Upgrade card modul for mtgjson v5
  # @see https://mtgjson.com/data-models/card
  def up
    remove_column :cards, :is_arena
    remove_column :cards, :is_mtgo
    remove_column :cards, :is_paper
    remove_column :cards, :legalities
    remove_column :cards, :names
    remove_column :cards, :prices
    remove_column :cards, :reverse_related
    remove_column :cards, :rulings

    add_column :cards, :availability, :string, array: true, default: []
    add_column :cards, :frame_effects, :string, array: true, default: []
    add_column :cards, :keywords, :string, array: true, default: []
    add_column :cards, :promo_types, :string, array: true, default: []
    add_column :cards, :purchase_urls, :string
    add_column :cards, :card_kingdom_foil_id, :string
    add_column :cards, :card_kingdom_id, :string
    add_column :cards, :duel_deck, :string
    add_column :cards, :face_name, :string
    add_column :cards, :frame_version, :string
    add_column :cards, :hand, :string
    add_column :cards, :has_alternative_deck_limit, :boolean, default: false
    add_column :cards, :has_content_warning, :boolean, default: false
    add_column :cards, :is_timeshifted, :boolean, default: false
    add_column :cards, :life, :string
    add_column :cards, :set_code, :string
    add_column :cards, :original_release_date, :date
  end

  def down
    add_column :cards, :is_arena, :boolean
    add_column :cards, :is_mtgo, :boolean
    add_column :cards, :is_paper, :boolean
    add_column :cards, :legalities, :string
    add_column :cards, :names, :string
    add_column :cards, :prices, :string
    add_column :cards, :reverse_related, :string
    add_column :cards, :rulings, :string

    remove_column :cards, :availability
    remove_column :cards, :frame_effects
    remove_column :cards, :keywords
    remove_column :cards, :promo_types
    remove_column :cards, :purchase_urls
    remove_column :cards, :card_kingdom_foil_id
    remove_column :cards, :card_kingdom_id
    remove_column :cards, :duel_deck
    remove_column :cards, :face_name
    remove_column :cards, :frame_version
    remove_column :cards, :hand
    remove_column :cards, :has_alternative_deck_limit
    remove_column :cards, :has_content_warning
    remove_column :cards, :is_timeshifted
    remove_column :cards, :life
    remove_column :cards, :set_code
    remove_column :cards, :original_release_date
  end
end
