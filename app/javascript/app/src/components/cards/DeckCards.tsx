import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { ImageOnly } from './card'
import { Deck } from '../../interface'

const StyledGrid = styled.div(({ theme, imageOnly }) => ({
  display: 'grid',
  gridColumnGap: theme.spaceScale(2),
  gridRowGap: theme.spaceScale(3),
  gridTemplateColumns: `repeat(auto-fill, minmax(${
    imageOnly ? '15rem' : '22rem'
  }, 1fr))`,
  gridAutoRows: imageOnly ? '23.5rem' : '7rem',
  justifyItems: 'center',
  alignItems: 'start',
}))

interface Props {
  deck: Deck
  updateDeck: () => {}
}

export const DeckCards = ({ deck, updateDeck }: Props): ReactElement => {
  // Converts cards to on object with the key being the category
  const cardsByCategory =
    deck &&
    deck.cards.reduce((categories, card) => {
      const category = card.categories[0]

      if (categories[category]) {
        categories[category].push(card)
      } else {
        categories[category] = [card]
      }

      return categories
    }, {})

  return (
    <>
      {Object.entries(cardsByCategory).map(([category, cardsInCategory]) => {
        return (
          <>
            <br />
            <h6>
              {category.toUpperCase()} ({`${cardsInCategory.length}`})
            </h6>
            <hr />
            <StyledGrid imageOnly>
              {(cardsInCategory || []).map(card => (
                <ImageOnly
                  key={card.id}
                  card={card}
                  options={{
                    name: deck.name,
                    deckId: deck.id,
                    updateDeck,
                  }}
                />
              ))}
            </StyledGrid>
          </>
        )
      })}
    </>
  )
}
