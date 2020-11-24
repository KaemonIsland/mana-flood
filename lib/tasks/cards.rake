require 'open-uri'
require 'zip'
require 'csv'

namespace :cards do
  desc "TODO"
  task download: :environment do
    content = open('https://www.mtgjson.com/files/AllPrintingsCSVFiles.zip')

    # Remove previous files
    file_names = ['cards.csv', 'sets.csv']
    file_names.each do |file|
      File.delete(file) if File.exist? (file)
    end

    Zip::File.open_buffer(content) do |zip|
      zip.each do |entry|
        if file_names.include? entry.name
          puts "Extracting #{entry.name}"
          # TODO - Find required files by name
          # Read through content
          # Update database of cards
          entry.extract
        end
      end
    end
  end

  task upload: :environment do
    puts "Uploading cards"

    csv_text = File.read('cards.csv')

    cards = CSV.parse(csv_text, headers: true)

    card_attrs = cards.map do |card|
      {
        artist: card["artist"] || '',
        border_color: card["borderColor"] || '',
        color_identity: card["colorIdentity"]&.split(',') || [],
        color_indicator: card["colorIndicator"] || '',
        colors: card["colors"] || '',
        converted_mana_cost: card["convertedManaCost"] || 0,
        edhrec_rank: card["edhrecRank"] || 0,
        face_converted_mana_cost: card["faceConvertedManaCost"] || 0,
        flavor_text: card["flavorText"] || '',
        has_foil: card["hasFoil"] === '1' ? true : false,
        has_non_foil: card["hasNonFoil"] === '1' ? true : false,
        is_alternative: card["isAlternative"] === '1' ? true : false,
        is_arena: card["isArena"] === '1' ? true : false,
        is_full_art: card["isFullArt"] === '1' ? true : false,
        is_mtgo: card["isMtgo"] === '1' ? true : false,
        is_online_only: card["isOnlineOnly"] === '1' ? true : false,
        is_oversized: card["isOversized"] === '1' ? true : false,
        is_paper: card["isPaper"] === '1' ? true : false,
        is_promo: card["isPromo"] === '1' ? true : false,
        is_reprint: card["isReprint"] === '1' ? true : false,
        is_reserved: card["isReserved"] === '1' ? true : false,
        is_starter: card["isStarter"] === '1' ? true : false,
        is_story_spotlight: card["isStorySpotlight"] === '1' ? true : false,
        is_textless: card["isTextless"] === '1' ? true : false,
        layout: card["layout"] || '',
        leadership_skills: card["leadershipSkills"] || '',
        legalities: card["legalities"] || '',
        loyalty: card["loyalty"] || '',
        mana_cost: card["manaCost"] || '',
        mcm_id: card["mcmId"] || 0,
        mcm_meta_id: card["mcmMetaId"] || 0,
        mtg_arena_id: card["mtgArenaId"] || 0,
        mtgo_foil_id: card["mtgoFoilId"] || 0,
        mtgo_id: card["mtgoId"] || 0,
        multiverse_id: card["multiverseId"] || 0,
        name: card["name"] || '',
        names: card["names"] || '',
        number: card["number"] || '',
        original_text: card["originalText"] || '',
        original_type: card["originalType"] || '',
        other_face_ids: card["otherFaceIds"] || '',
        power: card["power"] || '',
        prices: card["prices"] || '',
        printings: card["printings"] || '',
        rarity: card["rarity"] || '',
        reverse_related: card["reverseRelated"] || '',
        rulings: card["rulings"] || '',
        scryfall_id: card["scryfallId"] || '',
        scryfall_oracle_id: card["scryfallOracleId"] || '',
        scryfall_illustration_id: card["scryfallIllustrationId"] || '',
        side: card["side"] || '',
        subtypes: card["subtypes"] || '',
        supertypes: card["supertypes"] || '',
        tcgplayer_product_id: card["tcgplayerProductId"] || 0,
        text: card["text"] || '',
        toughness: card["toughness"] || '',
        card_type: card["type"] || '',
        card_types: card["types"] || '',
        uuid: card["uuid"] || '',
        variations: card["variations"] || '',
        watermark: card["watermark"] || '',
        ascii_name: card["asciiName"] || '',
        flavor_name: card["flavorName"] || '',
      }
    end

    Card.upsert_all(card_attrs, unique_by: [:uuid])
  end

  task sets: :environment do
    puts "Uploading cards"

    csv_text = File.read('sets.csv')

    card_sets = CSV.parse(csv_text, headers: true)

    card_set_attrs = card_sets.map do |card_set|
      # This is the only set with a repeated mcmId :shrug:
      if card_set && card_set["codeV3"] != 'DD3_EVG' && card_set["mcmId"].present?
        {
          base_set_size: card_set["baseSetSize"] || 0,
          block: card_set["block"] || '',
          code: card_set["code"] || '',
          code_v3: card_set["codeV3"] || '',
          is_foreign_only: card_set["isForeignOnly"] === '1' ? true : false,
          is_foil_only: card_set["isFoilOnly"] === '1' ? true : false,
          is_online_only: card_set["isOnlineOnly"] === '1' ? true : false,
          is_partial_preview: card_set["isPartialPreview"] === '1' ? true : false,
          keyrune_code: card_set["keyruneCode"] || '',
          mcm_name: card_set["mcmName"] || '',
          mcm_id: card_set["mcmId"]&.to_i || 0,
          mtgo_code: card_set["mtgoCode"] || '',
          name: card_set["name"] || '',
          parent_code: card_set["parentCode"] || '',
          release_date: card_set["releaseDate"] || '',
          tcgplayer_group_id: card_set["tcgplayerGroupId"] || 0,
          total_set_size: card_set["totalSetSize"] || 0,
          set_type: card_set["type"] || '',
        }
      end
    end

    CardSet.upsert_all(card_set_attrs.compact, unique_by: [:mcm_id])
  end

end
