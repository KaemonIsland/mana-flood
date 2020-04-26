import React from 'react'

export const useDeckStats = cards => {
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
   * subtypes are for creature types. Ex. Human, Cleric, Beast, Elemental, etc.
   * cmc Converted mana cost counts
   * Note: cmc 1 includes 0 costs and 1 mana. cmc 6 includes 6 or more mana
   */
  const stats = {
    colors: {
      W: 0,
      U: 0,
      B: 0,
      R: 0,
      G: 0,
      C: 0,
      M: 0,
    },
    types: {},
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
    },
    rarity: {
      common: 0,
      uncommon: 0,
      rare: 0,
      mythic: 0,
    },
    average: 0,
  }

  const { colors, types, cmc, counts, rarity } = stats

  // Iterates over every card and updates stats object
  cards.forEach(card => {
    console.log('Card: ', card)

    // Get card color count

    // Counts multicolored cards, we will count them and their individual colors
    if (card.colors.length > 1) {
      cards.M += 1
    }
    // Artifacts do not have colors, so we increment colorless
    if (card.colors.length === 0) {
      colors.C += 1
    } else {
      // Ortherwise we update the color identity
      card.colors.forEach(color => {
        colors[color] += 1
      })
    }

    // Card types, they have been stringified so we must parse them
    const cardTypes = JSON.parse(card.card_types)

    // Updates counts for creatures and nonCreatures
    if (cardTypes.includes('Creature')) {
      counts.creature += 1
    } else if (cardTypes.includes('Land')) {
      counts.land += 1
    } else {
      counts.nonCreature += 1
    }

    // Counts the card types
    cardTypes.forEach(type => {
      if (!types[type]) {
        types[type] = { count: 0, subtypes: {} }
      }

      if (types[type]) {
        types[type].count += 1
      } else {
        types[type].count = 1
      }

      // Counts the card subTypes
      card.subtypes.forEach(subtype => {
        if (types[type].subtypes[subtype]) {
          types[type].subtypes[subtype] += 1
        } else {
          types[type].subtypes[subtype] = 1
        }
      })
    })

    // Gets converted mana cost counts
    const cardCmc = card.converted_mana_cost

    if (cardTypes[0] === 'Land') {
      // Do nothing
    } else if (cardCmc <= 1) {
      cmc[1] += 1
    } else if (cardCmc >= 6) {
      cmc[6] += 1
    } else {
      cmc[cardCmc] += 1
    }

    // counts card rarity, doesn't include basic lands
    if (cardTypes[0] !== 'Land') {
      rarity[card.rarity] += 1
    }
  })
  // creates average mana cost
  let cmcTotal = 0
  let cardTotal = 0
  Object.entries(stats.cmc).forEach(([mana, amount]) => {
    cmcTotal += Number(mana) * amount
    cardTotal += amount
  })

  stats.average = cmcTotal / cardTotal

  return stats
}
