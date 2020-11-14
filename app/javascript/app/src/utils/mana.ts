import { unique } from './'

/**
 * Formats card mana cost to a usable array
 *
 * @param manaCost - Card mana cost. Ex. "{1}{W}{U}{B}"
 *
 * @returns Array containing only mana values without brackets. Ex. ["1", "W", "U", "B"]
 */
export const getManaCost = (manaCost: string): Array<string> =>
  manaCost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

/**
 * Gets all unique mana colors
 *
 * @param manaCost - contains all mana for a card
 *
 * @returns array containing unique mana values. Any of W, U, B, R, G
 */
export const uniqueColors = (manaCost: Array<string>): Array<string> =>
                       manaCost
                         // Removes numbers and X mana costs
                         .filter(char => isNaN(Number(char)) && char !== 'X')
                         .map(char => char.split(''))
                         .filter(Boolean)
                         .flat()
                         // Filters out duplicate mana symbols
                         .filter(unique)
