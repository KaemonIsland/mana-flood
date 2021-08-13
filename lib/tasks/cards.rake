require 'open-uri'
require 'zip'
require 'csv'

def get_card_files
  # Fetch csv files in zip format from mtgjson
  content = open('https://www.mtgjson.com/api/v5/AllPrintingsCSVFiles.zip')

  # Files required to update the card database
  file_names = ['cards.csv', 'sets.csv', 'legalities.csv', 'rulings.csv']

  # Clean up files!
  file_names.each do |file|
    File.delete(file) if File.exist? (file)
  end

  # Opens zip files and adds required files to root directory
  Zip::File.open_buffer(content) do |zip|
    zip.each do |entry|
      if file_names.include? entry.name
        puts "Extracting #{entry.name}"
        # Adds file to root directory
        entry.extract
      end
    end
  end
end

def remove_files

  # Files required to update the card database
  file_names = ['cards.csv', 'sets.csv', 'legalities.csv', 'rulings.csv']

  # Clean up files!
  file_names.each do |file|
    File.delete(file) if File.exist? (file)
  end
end

def update_legalities
  csv_text = File.read('legalities.csv')

  legalities = CSV.parse(csv_text, headers: true)

  legality_attrs = legalities.map do |legality|
    {
      mtgjson_id: legality["id"],
      format: legality["format"] || '',
      status: legality["status"] || '',
      uuid: legality["uuid"] || '',
    }
  end

  Legality.upsert_all(legality_attrs, unique_by: [:mtgjson_id])
end

def update_rulings
  csv_text = File.read('rulings.csv')

  rulings = CSV.parse(csv_text, headers: true)

  ruling_attrs = rulings.map do |ruling|
    {
      mtgjson_id: ruling["id"],
      date: ruling["date"] || '',
      text: ruling["text"] || '',
      uuid: ruling["uuid"] || '',
    }
  end

  Ruling.upsert_all(ruling_attrs, unique_by: [:mtgjson_id])
end

def update_card_sets
  csv_text = File.read('sets.csv')

  card_sets = CSV.parse(csv_text, headers: true)

  card_set_attrs = card_sets.map do |card_set|
    {
      index: card_set["index"].to_i,
      base_set_size: card_set["baseSetSize"] || 0,
      block: card_set["block"] || '',
      code: card_set["code"] || '',
      is_foreign_only: card_set["isForeignOnly"] === '1' ? true : false,
      is_foil_only: card_set["isFoilOnly"] === '1' ? true : false,
      is_non_foil_only: card_set["isNonFoilOnly"] === '1' ? true : false,
      is_online_only: card_set["isOnlineOnly"] === '1' ? true : false,
      is_partial_preview: card_set["isPartialPreview"] === '1' ? true : false,
      keyrune_code: card_set["keyruneCode"] || '',
      mtgo_code: card_set["mtgoCode"] || '',
      name: card_set["name"] || '',
      parent_code: card_set["parentCode"] || '',
      release_date: card_set["releaseDate"] || '',
      tcgplayer_group_id: card_set["tcgplayerGroupId"] || 0,
      total_set_size: card_set["totalSetSize"] || 0,
      set_type: card_set["type"] || '',
    }
  end

  CardSet.upsert_all(card_set_attrs.compact, unique_by: [:index])
end

def update_cards
  csv_text = File.read('cards.csv')

  cards = CSV.parse(csv_text, headers: true)

  card_attrs = cards.map do |card|
    {
      artist: card["artist"] || '',
      border_color: card["borderColor"] || '',
      color_identity: (card["colorIdentity"] || '')&.split(','),
      color_indicator: (card["colorIndicator"] || '')&.split(','),
      colors: (card["colors"] || '')&.split(','),
      converted_mana_cost: card["convertedManaCost"] || 0,
      edhrec_rank: card["edhrecRank"] || 0,
      face_converted_mana_cost: card["faceConvertedManaCost"] || 0,
      flavor_text: card["flavorText"] || '',
      has_foil: card["hasFoil"] === '1' ? true : false,
      has_non_foil: card["hasNonFoil"] === '1' ? true : false,
      is_alternative: card["isAlternative"] === '1' ? true : false,
      is_full_art: card["isFullArt"] === '1' ? true : false,
      is_online_only: card["isOnlineOnly"] === '1' ? true : false,
      is_oversized: card["isOversized"] === '1' ? true : false,
      is_promo: card["isPromo"] === '1' ? true : false,
      is_reprint: card["isReprint"] === '1' ? true : false,
      is_reserved: card["isReserved"] === '1' ? true : false,
      is_starter: card["isStarter"] === '1' ? true : false,
      is_story_spotlight: card["isStorySpotlight"] === '1' ? true : false,
      is_textless: card["isTextless"] === '1' ? true : false,
      layout: card["layout"] || '',
      leadership_skills: card["leadershipSkills"] || '',
      loyalty: card["loyalty"] || '',
      mana_cost: card["manaCost"] || '',
      mcm_id: card["mcmId"] || 0,
      mcm_meta_id: card["mcmMetaId"] || 0,
      mtg_arena_id: card["mtgArenaId"] || 0,
      mtgo_foil_id: card["mtgoFoilId"] || 0,
      mtgo_id: card["mtgoId"] || 0,
      multiverse_id: card["multiverseId"] || 0,
      name: card["name"] || '',
      number: card["number"] || '',
      original_text: card["originalText"] || '',
      original_type: card["originalType"] || '',
      other_face_ids: (card["otherFaceIds"] || '')&.split(','),
      power: card["power"] || '',
      printings: card["printings"] || '',
      rarity: card["rarity"] || '',
      scryfall_id: card["scryfallId"] || '',
      scryfall_oracle_id: card["scryfallOracleId"] || '',
      scryfall_illustration_id: card["scryfallIllustrationId"] || '',
      side: card["side"] || '',
      subtypes: (card["subtypes"] || '')&.split(','),
      supertypes: (card["supertypes"] || '')&.split(','),
      tcgplayer_product_id: card["tcgplayerProductId"] || 0,
      text: card["text"] || '',
      toughness: card["toughness"] || '',
      card_type: card["type"] || '',
      card_types: (card["types"] || '')&.split(','),
      uuid: card["uuid"] || '',
      variations: (card["variations"] || '')&.split(','),
      watermark: card["watermark"] || '',
      ascii_name: card["asciiName"] || '',
      flavor_name: card["flavorName"] || '',
      availability: (card["availability"] || '')&.split(','),
      frame_effects: (card["frameEffects"] || '')&.split(','),
      keywords: (card["keywords"] || '')&.split(','),
      promo_types: (card["promoTypes"] || '')&.split(','),
      purchase_urls: card["purchaseUrls"] || '',
      card_kingdom_foil_id: card["cardKingdomFoilId"] || '',
      card_kingdom_id: card["cardKingdomId"] || '',
      duel_deck: card["duelDeck"] || '',
      face_name: card["faceName"] || '',
      frame_version: card["frameVersion"] || '',
      hand: card["hand"] || '',
      has_alternative_deck_limit: card["hasAlternativeDeckLimit"] || '' === '1' ? true : false,
      has_content_warning: card["hasContentWarning"] || '' === '1' ? true : false,
      is_timeshifted: card["isTimeshifted"] || '' === '1' ? true : false,
      life: card["life"] || '',
      set_code: card["setCode"] || '',
      original_release_date: card["originalReleaseDate"] || '',
    }
  end

  Card.upsert_all(card_attrs, unique_by: [:uuid])
end

# I've had soooooo many problems linking cards to card sets.
# This time I think it'll work if we just clear out all cards, then re add them to the set.
def connect_cards_to_sets
  CardSet.all.each { |card_set|
    card_set.cards = []

    set_code = card_set.code

    cards = Card.where(set_code: set_code)

    card_set.cards << cards
  }
end

namespace :cards do
  desc "Updates all card info for the app"
  task update: :environment do
    puts "Fetching CSV files from MTGJSON"
    get_card_files()

    puts "Updating Legalities"
    update_legalities()

    puts "Updating Rulings"
    update_rulings()

    puts "Updating Card Sets"
    update_card_sets()

    puts "Updating Cards"
    update_cards()

    puts "Removing files"
    remove_files()

    puts "Connecting Cards to Card Sets"
    connect_cards_to_sets()
  end

  desc "Get's price of list of cards"
  task :price, [:cards] => :environment do |t, args|
    cards = args[:cards] || []
    public = Rails.application.credentials.tcg[:public]
    private = Rails.application.credentials.tcg[:private]

    access_token = HTTParty.post("https://api.tcgplayer.com/token?grant_type=client_credentials&client_id=#{public}&client_secret=#{private}")

    puts access_token.body

    puts "Getting card prices!"
  end
end
