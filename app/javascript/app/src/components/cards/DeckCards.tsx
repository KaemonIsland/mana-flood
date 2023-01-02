import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { ImageOnly } from './card'
import { useCardActions, useCards } from '../../utils'
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
}

export const DeckCards = ({ deck }: Props): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 1100 })
  const { cards, isLoading } = useCards({ deckId: deck.id, isDeck: true })
  const { actions } = useCardActions()

  return (
    <CardsContainer isMobile={isMobile}>
      <StyledGrid imageOnly>
        {isLoading ? (
          <h1>...Loading!</h1>
        ) : (
          cards.map(card => (
            <ImageOnly
              actions={actions}
              key={card.id}
              card={card}
              options={{ name: deck.name, deckId: deck.id }}
            />
          ))
        )}
      </StyledGrid>
    </CardsContainer>
  )
}
