require 'active_support/concern'

module CardStats
  extend ActiveSupport::Concern

  included do
  # colors is a representation of the card colors, not the individual mana costs
  # W = White
  # U = Blue
  # B = Black
  # R = Red
  # G = Green
  # C = Colorless
  # M = Multi

  # types represents each type of card. Ex. Creature, Instant, Land, etc.
  # types contains a count for basic types and an object of subtypes

  # subtypes are for creature types. Ex. Human, Cleric, Beast, Elemental, etc.

  # cmc Converted mana cost counts
  # Note: cmc 1 includes 0 costs and 1 mana. cmc 6 includes 6 or more mana

  # Average is the average mana cost not including lands

  # Rarity keeps track of card rarities
  def self.card_stats (cards)
    stats = {
      colors: {
        W: 0,
        U: 0,
        B: 0,
        R: 0,
        G: 0,
        C: 0,
        M: 0,
      },
      types: {
        creature: { count: 0, subtypes: {} },
        enchantment: { count: 0, subtypes: {} },
        instant: { count: 0, subtypes: {} },
        land: { count: 0, subtypes: {} },
        sorcery: { count: 0, subtypes: {} },
        planeswalker: { count: 0, subtypes: {} },
        artifact: { count: 0, subtypes: {} },
      },
      cmc: {
        1 => 0,
        2 => 0,
        3 => 0,
        4 => 0,
        5 => 0,
        6 => 0,
      },
      counts: {
        creature: 0,
        nonCreature: 0,
        land: 0,
        nonLand: 0,
      },
      rarity: {
        common: 0,
        uncommon: 0,
        rare: 0,
        mythic: 0,
      },
      cards: 0,
    }

      # Iterates over every card and updates stats object
      cards.any? && cards.each do |card|
      
        if card.is_promo || card.is_alternative
          next
        end

        # Increment total cards
        stats[:cards] += 1

        # Card types, they have been stringified so we must parse them
        card_types = JSON.parse(card.card_types)
        types = stats[:types]


        # Counts the card types
        card_types.each do |type|
          lower_type = type.downcase().to_sym
  
          if types[lower_type]
            types[lower_type][:count] += 1
          end
          
  
            # Counts the card subTypes
            card.subtypes.each do |subtype|
              lower_subtype = subtype.downcase().to_sym

              if types[lower_type] && types[lower_type][:subtypes] && types[lower_type][:subtypes][lower_subtype]
                types[lower_type][:subtypes][lower_subtype] += 1
              elsif types[lower_type] && types[lower_type][:subtypes]
                types[lower_type][:subtypes][lower_subtype] = 1
              end
            end
        end


        # Counts multicolored cards and individual colors
        if card.color_identity.length > 1
          stats[:colors][:M] += 1
        end

        

        # Artifacts do not have colors, so we increment colorless
        if (card.color_identity.length === 0) 
          stats[:colors][:C] += 1
        end

        

        # Otherwise we update the color identity
        card.color_identity.each { |color|
          stats[:colors][color.to_sym] += 1
        }


        # if the card is a land we just need to up the land count. Otherwise we set a few more counts
        if (card.card_type.include?('Basic Land')) 
          stats[:counts][:land] += 1
        else
          stats[:counts][:nonLand] += 1

    
          # Updates counts for creatures and nonCreatures
          if card_types.include?('Creature')
            stats[:counts][:creature] += 1
          else
            stats[:counts][:nonCreature] += 1
          end

          # Gets converted mana cost counts
          card_cmc = card.converted_mana_cost
    
          # Increments 1 mana for 1 or 0 cmc
          if (card_cmc <= 1) 
            stats[:cmc][1] += 1
    
            # Increments 6 mana for 6 or more cmc
          elsif (card_cmc >= 6) 
            stats[:cmc][6] += 1
    
            # Otherwise we increment what's in-between as long as it's not a land
          else
            stats[:cmc][card_cmc.to_i] += 1
          end
    
          # counts card rarity, doesn't include basic lands
          stats[:rarity][card.rarity.to_sym] += 1
        end


      end

      stats
  end
  end
end