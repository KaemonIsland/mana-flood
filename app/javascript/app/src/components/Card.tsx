import React, { useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, Flex, Button, Image } from 'warlock-ui'
import fetch from 'cross-fetch'
import { ManaSymbol } from './ManaSymbol'

const OuterContainer = styled.div`
  width: 22rem;
  margin: 1rem;
`

const CardContainer = styled.div(({ theme, color }) => {
  let backgroundColor = theme.color['yellow'][5]
  switch (color) {
    case 'W':
      backgroundColor = theme.color['coolGrey'][0]
      break
    case 'U':
      backgroundColor = theme.color['blue'][3]
      break
    case 'B':
      backgroundColor = theme.color['grey'][9]
      break
    case 'G':
      backgroundColor = theme.color['green'][3]
      break
    case 'R':
      backgroundColor = theme.color['red'][3]
      break
    default:
      backgroundColor = theme.color['blueGrey'][2]
      break
  }
  return {
    border: '1px solid black',
    padding: theme.formatSpace(3),
    width: theme.formatSpace(13),
    color: color === 'B' ? 'white' : 'black',
    backgroundColor,
    borderRadius: '2rem',
    transition: 'all 300ms ease-out',
  }
})

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardTitle = styled.div`
  font-weight: bold;
  width: 100%;
`

const PowerToughnessBig = styled.div`
  border-radius: 2rem / 4rem;
  padding: 0 0.8rem;
  font-weight: bold;
`

const CardSet = styled.div(({ theme, rarity }) => {
  let color = 'black'
  switch (rarity) {
    case 'uncommon':
      color = 'silver'
      break
    case 'rare':
      color = 'gold'
      break
    case 'mythic':
      color = theme.color['orangeVivid'][6]
      break
    default:
      color = 'black'
      break
  }
  return {
    backgroundColor: color,
    borderRadius: '50%',
    width: '1.3rem',
    height: '1.3rem',
    boxShadow: '0 2px 4px black',
  }
})

const CardType = styled.div`
  font-size: 0.8rem;
  font-style: italic;
`

const CardText = styled.div`
  font-size: 0.8rem;
`

const StyledMana = styled.div(({ theme }) => ({
  width: theme.formatSpace(5),
  height: theme.formatSpace(5),
  margin: `${theme.formatSpace(2)} 0`,
}))

export const Card = cardInfo => {
  const [card, setCard] = useState(cardInfo)

  const {
    artist,
    border_color,
    card_set_id,
    card_type,
    card_types,
    color_identity,
    converted_mana_cost,
    flavor_text,
    id,
    mana_cost,
    name,
    number,
    original_text,
    power,
    prices,
    rarity,
    rulings,
    text,
    toughness,
    uuid,
    has_card,
    quantity,
    ...rest
  } = card

  const addToCollection = async () => {
    try {
      const response = await fetch(`/api/v1/add_card/${id}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCard(data)
    } catch (error) {
      console.log('Unable to add card to collection', console.error)
    }
  }

  const removeFromCollection = async () => {
    try {
      const response = await fetch(`/api/v1/remove_card/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCard(data)
    } catch (error) {
      console.log('Unable to remove card to collection', console.error)
    }
  }

  const updateCollectionQuantity = async newQuantity => {
    if (newQuantity === 0) {
      return removeFromCollection()
    }

    try {
      const response = await fetch(
        `/api/v1/add_card/${id}?quantity=${newQuantity}`,
        {
          method: 'PUT',
        }
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCard(data)
    } catch (error) {
      console.log('Unable to remove card to collection', console.error)
    }
  }

  const formatedMana = mana_cost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

  return (
    <ThemeProvider>
      <OuterContainer>
        <CardContainer
          color={
            Array.isArray(color_identity) ? color_identity[0] : color_identity
          }
        >
          <CardInfo>
            <CardTitle>{name}</CardTitle>
            <Flex alignItems="center" justifyContent="end">
              {formatedMana.length !== 0 &&
                formatedMana.map(mana => (
                  <StyledMana>
                    <ManaSymbol mana={mana} />
                  </StyledMana>
                ))}
            </Flex>
          </CardInfo>
          <CardInfo>
            <CardType>{card_type}</CardType>
            <CardSet rarity={rarity} />
          </CardInfo>
          <hr />
          <CardText>{text}</CardText>
          {/* if creature */}
          {power && toughness && (
            <Flex alignItems="center" justifyContent="center">
              <PowerToughnessBig>
                {power} / {toughness}
              </PowerToughnessBig>
            </Flex>
          )}
          <hr />
          <Flex justifyContent="space-between" alignItems="center">
            {has_card ? (
              <>
                <Button
                  title="-"
                  callback={() => updateCollectionQuantity(quantity - 1)}
                />
                <Button
                  title="+"
                  callback={() => updateCollectionQuantity(quantity + 1)}
                />
              </>
            ) : (
              <Button title="+" callback={addToCollection} />
            )}
          </Flex>

          {has_card && <div>{quantity} in collection.</div>}
        </CardContainer>
      </OuterContainer>
    </ThemeProvider>
  )
}

{
  /* <div>
    <ul>
        <% @card_set.cards.each do |card| %>
        <li><%= card.name %></li>
        <img src="https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=<%= card.multiverse_id %>&type=card" />

        <% if card.collected_cards.find_by(collection_id: current_user.collection).present? %>
        <div>Collected: <%= card.collected_cards.find_by(collection_id: current_user.collection).quantity %></div>
        <% end %>

        <% end %>
    </ul>
</div> */
}
