import React from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'warlock-ui'

const OuterContainer = styled.div`
  position: relative;
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
      backgroundColor = theme.color['blue'][4]
      break
    case 'B':
      backgroundColor = theme.color['grey'][8]
      break
    case 'G':
      backgroundColor = theme.color['green'][4]
      break
    case 'R':
      backgroundColor = theme.color['red'][4]
      break
    default:
      console.log("Color didn't work: ", color)
      backgroundColor = theme.color['grey'][3]
      break
  }
  return {
    border: '1px solid black',
    padding: '0.8rem 1.5rem',
    width: '22rem',
    color: 'black',
    backgroundColor,
    borderRadius: '2rem',
    cursor: 'pointer',
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
`

// position: absolute;
// top: 95%;
// left: 50%;
// transform: translateX(-50%);

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

export const Card = ({
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
  ...rest
}) => {
  // console.log('Card: ', rest)
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
            <div>{mana_cost}</div>
          </CardInfo>
          <CardInfo>
            <CardType>{card_type}</CardType>
            <CardSet rarity={rarity} />
          </CardInfo>
          <hr />
          <CardText>{text}</CardText>
          {/* if creature */}
          {power && toughness && (
            <PowerToughnessBig>
              {power} / {toughness}
            </PowerToughnessBig>
          )}
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
