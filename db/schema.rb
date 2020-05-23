# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_23_161506) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "card_sets", force: :cascade do |t|
    t.integer "base_set_size"
    t.string "block"
    t.string "code"
    t.string "code_v3"
    t.boolean "is_foreign_only"
    t.boolean "is_foil_only"
    t.boolean "is_online_only"
    t.boolean "is_partial_preview"
    t.string "keyrune_code"
    t.string "mcm_name"
    t.integer "mcm_id"
    t.string "mtgo_code"
    t.string "name"
    t.string "parent_code"
    t.string "release_date"
    t.integer "tcgplayer_group_id"
    t.integer "total_set_size"
    t.string "set_type"
    t.index ["mcm_id"], name: "index_card_sets_on_mcm_id", unique: true
  end

  create_table "cards", force: :cascade do |t|
    t.string "artist"
    t.string "border_color"
    t.string "color_identity"
    t.string "color_indicator"
    t.string "colors"
    t.float "converted_mana_cost"
    t.integer "edhrec_rank"
    t.float "face_converted_mana_cost"
    t.string "flavor_text"
    t.boolean "has_foil"
    t.boolean "has_non_foil"
    t.boolean "is_alternative"
    t.boolean "is_arena"
    t.boolean "is_full_art"
    t.boolean "is_mtgo"
    t.boolean "is_online_only"
    t.boolean "is_oversized"
    t.boolean "is_paper"
    t.boolean "is_promo"
    t.boolean "is_reprint"
    t.boolean "is_reserved"
    t.boolean "is_starter"
    t.boolean "is_story_spotlight"
    t.boolean "is_textless"
    t.string "layout"
    t.string "leadership_skills"
    t.string "legalities"
    t.string "loyalty"
    t.string "mana_cost"
    t.integer "mcm_id"
    t.integer "mcm_meta_id"
    t.integer "mtg_arena_id"
    t.integer "mtgo_foil_id"
    t.integer "mtgo_id"
    t.integer "multiverse_id"
    t.string "name"
    t.string "names"
    t.string "number"
    t.string "original_text"
    t.string "original_type"
    t.string "other_face_ids"
    t.string "power"
    t.string "prices"
    t.string "printings"
    t.string "rarity"
    t.string "reverse_related"
    t.string "rulings"
    t.string "scryfall_id"
    t.string "scryfall_oracle_id"
    t.string "scryfall_illustration_id"
    t.string "side"
    t.string "subtypes"
    t.string "supertypes"
    t.integer "tcgplayer_product_id"
    t.string "text"
    t.string "toughness"
    t.string "card_type"
    t.string "card_types"
    t.string "uuid"
    t.string "variations"
    t.string "watermark"
    t.bigint "card_set_id"
    t.string "ascii_name"
    t.string "flavor_name"
    t.index ["card_set_id"], name: "index_cards_on_card_set_id"
    t.index ["uuid"], name: "index_cards_on_uuid", unique: true
  end

  create_table "collected_cards", force: :cascade do |t|
    t.bigint "collection_id"
    t.bigint "card_id"
    t.integer "quantity"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["card_id"], name: "index_collected_cards_on_card_id"
    t.index ["collection_id"], name: "index_collected_cards_on_collection_id"
  end

  create_table "collections", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_collections_on_user_id"
  end

  create_table "decked_cards", force: :cascade do |t|
    t.bigint "deck_id"
    t.bigint "card_id"
    t.integer "quantity"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["card_id"], name: "index_decked_cards_on_card_id"
    t.index ["deck_id"], name: "index_decked_cards_on_deck_id"
  end

  create_table "decks", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name"
    t.string "description"
    t.string "format"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_decks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", default: "", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.boolean "admin", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cards", "card_sets"
end
