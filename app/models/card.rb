class Card < ApplicationRecord
  include CardStats

  has_many :card_set_cards
  has_many :card_sets, through: :card_set_cards

  has_many :collected_cards, dependent: :destroy
  has_many :collections, through: :collected_cards

  has_many :decked_cards, dependent: :destroy
  has_many :decks, through: :decked_cards

  validates :uuid, presence: true, uniqueness: { case_sensitive: false }

  # Serialize Objects/Arrays https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html
  serialize :preferences, JSON
  serialize :leadership_skills, JSON
  serialize :printings, JSON
  serialize :variations, JSON
  serialize :purchase_urls, JSON

  # Return all Legalities for a card
  def legalities
    Legality.where(uuid: self.uuid)
  end

  # Return all rulings for a card
  def rulings
    Ruling.where(uuid: self.uuid)
  end

  # Gets the locations the card is currently used in. (Decks, Collections)
  def locations(user_id)
    location = []

    # Find collected_card
    collection = Collection.find_by(user_id: user_id)
    collected = CollectedCard.find_by(card_id: self.id, collection_id: collection.id)

    # Add collection type if collected_card found
    if collected
      location << { type: 'collection', quantity: collected.quantity, foil: collected.foil }
    end

    # Finds decks the card belongs to
    deck_ids = User.find(user_id).decks.ids
    decked = DeckedCard.where(deck_id: deck_ids, card_id: self.id)

    # Add decked cards if decked found
    if decked.present?
      decked.each do |decked_card|
        deck = decked_card.deck

        location << {
          type: 'deck',
          quantity: decked_card.quantity,
          foil: decked_card.foil,
          name: deck.name,
          description: deck.description,
          format: deck.format,
          deck_id: deck.id
        }
      end
    end

    return location
  end

  # Gets the number of cards within the collection
  def collection_quantity(collection_id)
    return 0 unless collection_id

    collected = self.collected_cards.select { |col| col.collection_id === collection_id }

    collected.empty? ? 0 : collected.first
  end

  # Gets the number of the card used within a specific deck
  def deck_quantity(deck_id)
    return 0 unless deck_id

    decked = self.decked_cards.select { |deck| deck.deck_id === deck_id }

    decked.empty? ? 0 : decked.first
  end

  ############## SORTING #############
  # Sorts by mana cost first then alphabetical by name
  def self.by_mana_and_name
    order(converted_mana_cost: :asc, name: :asc)
  end

  # Sorts cards by color White, Blue, Black, Red, Green, Colorless, Multi
  def self.sort_by_color(cards)
    # All card colors to be sorted by.
    # W = White
    # U = Blue
    # B = Black
    # R = Red
    # G = Green
    # M = Multi - Any card with more than one color within color_identity
    # C = Colorless - Any card with an empty color_identity
    @colors = {
      W: [],
      U: [],
      B: [],
      R: [],
      G: [],
      M: [],
      C: [],
    }

    cards.each do |card|
      card_colors = card.color_identity

      if card_colors.empty?
        @colors[:C] << card
      elsif card_colors.length >= 2
        @colors[:M] << card
      else
        @colors[card_colors[0].to_sym] << card
      end
    end

    [].concat(
      @colors[:W],
      @colors[:U],
      @colors[:B],
      @colors[:R],
      @colors[:G],
      @colors[:M],
      @colors[:C])
  end



  ################ SCOPE #################
  # Any card without a color
  scope :colorless, -> { where(color_identity: []) }

  # Any card with more than one color
  scope :multi_color, -> { where('array_length(color_identity, 1) > 1') }

  # Specific Single or Multi color
  scope :combo_color, -> (colors) { where("color_identity @> ARRAY[?]::varchar[]", colors) }

  # Card has color within identity
  scope :single_color, -> (color) { where("'#{color}' = ANY (color_identity)") }

  def self.with_color(card_colors, scope)
    return where.not(color_identity: [nil]) unless card_colors

    colors = card_colors.split(',').uniq

    if colors.length === 1 && colors.first === 'M'
      multi_color
    elsif colors.length === 1 && colors.first === 'C'
      colorless
    elsif colors.length >= 2 && colors.include?('M')
      colors.delete('M')
      combo_color(colors).multi_color
    elsif colors.length === 1
      single_color(colors.first)
    else
      # Searches for multiple colors in OR fashion
      colors[1..-1].inject(single_color(colors.first)) {|s, color| s.or(scope.single_color(color)) }
    end
  end
end
