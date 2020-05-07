import React, { useState, useEffect } from 'react'

export const useDeckStats = (cards, format) => {
  /**
   * This is the default object for setting all of the stats.
   *
   * colors is a representation of the card colors, not the individual mana costs
   * W = White
   * U = Blue
   * B = Black
   * R = Red
   * G = Green
   * C = Colorless
   * M = Multi
   *
   * types represents each type of card. Ex. Creature, Instant, Land, etc.
   * types contains a count for basic types and an object of subtypes
   *
   * subtypes are for creature types. Ex. Human, Cleric, Beast, Elemental, etc.
   *
   * cmc Converted mana cost counts
   * Note: cmc 1 includes 0 costs and 1 mana. cmc 6 includes 6 or more mana
   *
   * Average is the average mana cost not including lands
   *
   * Rarity keeps track of card rarities
   */
  const defaultStats = {
    isLegal: true,
    colors: {
      total: 0,
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
    },
    cmc: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
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

  const [stats, setStats] = useState(defaultStats)
  // Calculates average card cmc
  const average =
    +(
      Object.entries(stats.cmc).reduce(
        (cur, arr) => cur + Number(arr[0]) * arr[1],
        0
      ) /
      (stats.counts.creature + stats.counts.nonCreature)
    ).toFixed(1) || 0

  const generateStats = cardsArr => {
    const newStats = { ...defaultStats }
    const { colors, types, cmc, counts, rarity } = newStats
    // Iterates over every card and updates stats object
    cardsArr.forEach(card => {
      console.log(card)
      const multiplier = card.deck.quantity

      if (format !== 'casual' && card.legalities[format] !== 'Legal') {
        stats.isLegal = false
      }

      // Increment total cards
      newStats.cards += multiplier
      // Card types, they have been stringified so we must parse them
      const cardTypes = JSON.parse(card.card_types)

      // Counts the card types
      cardTypes.forEach(type => {
        const lowerType = type.toLowerCase()

        if (types[lowerType]) types[lowerType].count += multiplier

        // Counts the card subTypes
        card.subtypes.forEach(subtype => {
          const lowerSubtype = subtype.toLowerCase()
          if (types[lowerType].subtypes[lowerSubtype]) {
            types[lowerType].subtypes[lowerSubtype] += multiplier
          } else {
            types[lowerType].subtypes[lowerSubtype] = multiplier
          }
        })
      })

      // if the card is a land we just need to up the land count. Otherwise we set a few more counts
      if (card.card_type.includes('Basic Land')) {
        counts.land += multiplier
      } else {
        counts.nonLand += multiplier
        // Counts multicolored cards, we will count them and their individual colors
        // We will increment multi and whatever individual colors it contains
        if (card.colors.length > 1) {
          colors.M += multiplier
        }

        // Artifacts do not have colors, so we increment colorless
        if (card.colors.length === 0) {
          colors.total += multiplier
          colors.C += multiplier
        }

        // Otherwise we update the color identity
        card.colors.forEach(
          color => (colors[color] += multiplier) && (colors.total += multiplier)
        )

        // Updates counts for creatures and nonCreatures
        cardTypes.includes('Creature')
          ? (counts.creature += multiplier)
          : (counts.nonCreature += multiplier)

        // Gets converted mana cost counts
        const cardCmc = card.converted_mana_cost

        // Increments 1 mana for 1 or 0 cmc
        if (cardCmc <= 1) {
          cmc[1] += multiplier

          // Increments 6 mana for 6 or more cmc
        } else if (cardCmc >= 6) {
          cmc[6] += multiplier

          // Otherwise we increment what's in-between as long as it's not a land
        } else {
          cmc[cardCmc] += multiplier
        }

        // counts card rarity, doesn't include basic lands
        rarity[card.rarity] += multiplier
      }
    })

    setStats(newStats)
  }

  useEffect(() => {
    generateStats(cards)
  }, [cards])

  return { ...stats, average }
}
