import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { ImageOnly } from './card'
import { Deck } from '../../interface'

const CardsContainer = styled.section(({ theme, isMobile, showFilter }) => ({
  display: 'grid',
  gridTemplateColumns:
    isMobile || !showFilter ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  margin: isMobile && theme.spaceScale(4),
  gridTemplateRows: isMobile ? `${theme.spaceScale(6)} 1fr` : 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div(({ theme, imageOnly }) => ({
  display: 'grid',
  gridGap: theme.spaceScale(3),
  gridTemplateColumns: `repeat(auto-fill, minmax(${
    imageOnly ? '16rem' : '22rem'
  }, 1fr))`,
  gridAutoRows: imageOnly ? '26rem' : '7rem',
  justifyItems: 'center',
  alignItems: 'start',
}))

interface Props {
  deck: Deck
  updateDeck: () => {}
}

export const DeckCards = ({ deck, updateDeck }: Props): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 1100 })

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
            <h2>
              {category.toUpperCase()}({`${cardsInCategory.length}`})
            </h2>
            <hr />
            <CardsContainer isMobile={isMobile}>
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
            </CardsContainer>
          </>
        )
      })}
    </>
  )
}
