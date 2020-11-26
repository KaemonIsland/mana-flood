class Deck < ApplicationRecord
  belongs_to :user
  has_many :decked_cards, dependent: :destroy
  has_many :cards, -> { distinct }, through: :decked_cards

  validates :name, presence: true

  def colors
    order = ['W', 'U', 'B', 'R', 'G']
    card_colors = []
    self.cards.each{ |card| 
      card_colors << card.color_identity
    }

    card_colors.flatten.uniq.sort do |e1, e2|
      order.index(e1) <=> order.index(e2)
    end
  end

  # This is the default object for setting all of the stats.

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
  def card_stats
    stats = {
      colors: {
        W: 0,
        U: 0,
        B: 0,
        R: 0,
        G: 0,
        C: 0,
        M: 0,
        total: 0
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

    

    cards = self.cards
      # Iterates over every card and updates stats object
      cards.each do |card|
        multiplier = card.deck_quantity(self.id)
      
        if card.is_promo || card.is_alternative
          next
        end

        # Increment total cards
        stats[:cards] += multiplier


        # Card types, they have been stringified so we must parse them
        card_types = card.card_types
        types = stats[:types]


        # Counts the card types
        card_types.each do |type|
          lower_type = type.downcase().to_sym
  
          if types[lower_type]
            types[lower_type][:count] += multiplier
          end
          
  
          # Counts the card subTypes
          card.subtypes&.split(' ').each do |subtype|
            lower_subtype = subtype.downcase().to_sym

            if types[lower_type] && types[lower_type][:subtypes] && types[lower_type][:subtypes][lower_subtype]
              types[lower_type][:subtypes][lower_subtype] += multiplier
            elsif types[lower_type] && types[lower_type][:subtypes]
              types[lower_type][:subtypes][lower_subtype] = multiplier
            end
          end
        end


        # Counts multicolored cards and individual colors
        if card.color_identity.length > 1
          stats[:colors][:M] += multiplier
        end

        

        # Artifacts do not have colors, so we increment colorless
        if (card.color_identity.length === 0) 
          stats[:colors][:C] += multiplier
          stats[:colors][:total] += multiplier
        end
        
        
        
        # Otherwise we update the color identity
        card.color_identity.each { |color|
          stats[:colors][color.to_sym] += multiplier
          stats[:colors][:total] += multiplier
        }


        # if the card is a land we just need to up the land count. Otherwise we set a few more counts
        if (card.card_type.include?('Basic Land')) 
          stats[:counts][:land] += multiplier
        else
          stats[:counts][:nonLand] += multiplier

    
          # Updates counts for creatures and nonCreatures
          if card_types.include?('Creature')
            stats[:counts][:creature] += multiplier
          else
            stats[:counts][:nonCreature] += multiplier
          end

          # Gets converted mana cost counts
          card_cmc = card.converted_mana_cost
    
          # Increments 1 mana for 1 or 0 cmc
          if (card_cmc <= 1) 
            stats[:cmc][1] += multiplier
    
            # Increments 6 mana for 6 or more cmc
          elsif (card_cmc >= 6) 
            stats[:cmc][6] += multiplier
    
            # Otherwise we increment what's in-between as long as it's not a land
          else
            stats[:cmc][card_cmc.to_i] += multiplier
          end
    
          # counts card rarity, doesn't include basic lands
          stats[:rarity][card.rarity.to_sym] += multiplier
        end


      end

      stats
  end
end
