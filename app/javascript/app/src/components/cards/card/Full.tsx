import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Text, Container, Flex, Grid, Button } from 'warlock-ui'
import { ManaSymbol } from '../../ManaSymbol'
import { getCardImage, useCards, formatDate } from '../../../utils'
import { Page } from '../../page'
import styled from 'styled-components'

Button.Left = styled(Button)`
  border-radius: 1rem 0 0 1rem;
  background-color: transparent;
`
Button.Middle = styled.div`
  border-radius: 0;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.color['grey'][8]};
  display: inline-block;
  text-align: center;
  padding: ${({ theme }) =>
    [theme.spaceScale(1), theme.spaceScale(2)].join(' ')};
`
Button.Right = styled(Button)`
  border-radius: ${({ theme, hasCard }) =>
    hasCard ? '0 1rem 1rem 0' : theme.spaceScale(1)};
  background-color: transparent;
`

const CardInfo = styled.div(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.spaceScale(1),
  boxShadow: theme.boxShadow.single[1],
  padding: theme.spaceScale(2),
}))

const RulesContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.color.blueGrey[2],
  border: `1px solid ${theme.color.blueGrey[5]}`,
  padding: theme.spaceScale(2),
  boxShadow: theme.boxShadow.inset(theme.color.blueGrey[2]),
  overflowY: 'scroll',
  maxHeight: theme.spaceScale(12),
  '& > :not(:last-child)': {
    borderBottom: `1px solid ${theme.color.blueGrey[3]}`,
  },
}))

const StyledRule = styled.div(({ theme }) => ({
  marginBottom: theme.spaceScale(4),
  padding: `${theme.spaceScale(2)} 0`,
}))

const CardImgContainer = styled.div(({ theme }) => ({
  width: '16rem',
  marginRight: theme.spaceScale(4),
  borderRadius: theme.spaceScale(4),
  overflow: 'hidden',
  boxShadow: theme.boxShadow.single[2],
}))

const CardImg = styled.img(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  height: '100%',
}))

const StyledLegal = styled.div(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  padding: theme.spaceScale(2),
}))

StyledLegal.Title = styled.p(({ theme }) => ({
  fontFamily: 'Open Sans',
  textTransform: 'uppercase',
}))

StyledLegal.Status = styled.p(({ theme, isLegal }) => ({
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontSize: theme.fontScale(2),
  backgroundColor: theme.color[isLegal ? 'green' : 'red'][6],
  borderRadius: theme.spaceScale(1),
  padding: `${theme.spaceScale(1)} ${theme.spaceScale(2)}`,
  color: 'white',
}))

export const Full = ({ id }) => {
  const { actions, scope, deck } = useCards('collection')
  const [img, setImg] = useState('')
  const [variations, setVariations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [{ name, mana_cost, collection, ...card }, setCard] = useState({
    mana_cost: '',
    name: '',
    collection: {
      has_card: false,
      quantity: 0,
    },
  })
  const { has_card, quantity } = collection
  const { add, update, remove } = actions

  const getVariationInfo = async card => {
    if (card.variations) {
      card.variations = await Promise.all(
        card.variations.map(async variant => ({
          ...variant,
          imgUrl: await getCardImage(variant.scryfall_id, 'large'),
        }))
      )
    }

    setVariations(card)
  }

  const addCard = async cardId => {
    setCard(await add(cardId, deck && deck.id))
  }

  const removeCard = async cardId => {
    setCard(await remove(cardId, deck && deck.id))
  }

  const updateCard = async (cardId, newQuantity) => {
    setCard(await update(cardId, newQuantity, deck && deck.id))
  }

  const getCard = async () => {
    try {
      const response = await axios(`/api/v1/card/${id}`)

      const { data } = response

      if (data) {
        return data
      } else {
        throw new Error(data)
      }
    } catch (error) {
      console.log('Unable to get card: ', error)
    }
  }

  const initialize = async () => {
    const card = await getCard()
    const cardUrl = await getCardImage(card.scryfall_id, 'large')

    getVariationInfo(card)

    setCard(card)
    setImg(cardUrl)

    setIsLoading(false)
  }

  // Formats the cards mana cost for us to easily use mana symbol svgs
  const formattedMana = mana_cost
    .replace(/[{ | }]/g, ' ')
    .replace(/\//g, '')
    .split(' ')
    .filter(Boolean)

  useEffect(() => {
    initialize()
  }, [])
  return (
    <Page>
      {!isLoading ? (
        <Grid
          alignItems="start"
          justifyContent="center"
          templateColumns={Grid.repeat(4, Grid.fr(1))}
          templateRows="auto"
          templateAreas={[
            'name name name cmc',
            'mainImage actions info info',
            'legal legal legal legal',
            'variations variations variations variations',
            'rules rules rules rules',
          ]}
        >
          <Grid.Item area="name">
            <Text size={10} family="source sans">
              {name}
            </Text>
          </Grid.Item>
          <Grid.Item area="cmc" justifySelf="end">
            <Container width="7rem">
              <Flex alignItems="center" justifyContent="start">
                {formattedMana.length !== 0 &&
                  formattedMana.map((mana, i) => (
                    <ManaSymbol size="large" key={i} mana={mana} />
                  ))}
              </Flex>
            </Container>
          </Grid.Item>
          <Grid.Item area="mainImage">
            <CardImgContainer>
              <CardImg src={img} alt={name} />
            </CardImgContainer>
          </Grid.Item>
          <Grid.Item area="actions">
            <CardInfo>
              <Flex alignItems="center" justifyContent="space-between">
                Collection:
                <Flex alignItems="center" justifyContent="end">
                  {has_card && (
                    <>
                      <Button.Left
                        color="grey"
                        shade={8}
                        size="small"
                        variant="outline"
                        bubble={false}
                        isDisabled={!has_card}
                        onClick={() => {
                          const newQuantity = quantity - 1
                          if (newQuantity) {
                            updateCard(id, newQuantity)
                          } else {
                            removeCard(id)
                          }
                        }}
                      >
                        -
                      </Button.Left>
                      <Button.Middle
                        color="grey"
                        shade={8}
                        variant="outline"
                        isDisabled
                      >
                        {has_card && quantity}
                      </Button.Middle>
                    </>
                  )}
                  <Button.Right
                    hasCard={has_card}
                    color="grey"
                    shade={8}
                    size="small"
                    bubble={false}
                    variant="outline"
                    onClick={() => {
                      if (has_card) {
                        updateCard(id, quantity + 1)
                      } else {
                        addCard(id)
                      }
                    }}
                  >
                    +
                  </Button.Right>
                </Flex>
              </Flex>
              <hr />
            </CardInfo>
          </Grid.Item>
          <Grid.Item area="info">
            <CardInfo>
              <Text isItalics>{card.card_type}</Text>
              <hr />
              <Container maxWidth="35rem">
                {card.text.split('\n').map(text => (
                  <div style={{ marginBottom: '0.5rem' }}>
                    {text.replace(/[{}]/g, ' ')}
                  </div>
                ))}
              </Container>
              <hr />
              {card.power && (
                <>
                  <div>
                    {card.power} / {card.toughness}
                  </div>
                  <hr />
                </>
              )}
              {card.flavor_text && (
                <>
                  <Text isItalics>{card.flavor_text}</Text>
                  <hr />
                </>
              )}
              <div>
                Illustrated by{' '}
                <Text isItalics display="inline-block">
                  {card.artist}
                </Text>
              </div>
              <hr />
              <div>
                <Text isItalics display="inline-block">
                  {card.rarity}
                </Text>
                , {card.number}
              </div>
            </CardInfo>
          </Grid.Item>
          <Grid.Item area="legal">
            <CardInfo>
              <Flex flexWrap="wrap" alignItems="center" justifyContent="start">
                {Object.entries(card.legalities).map(([title, legal]) => (
                  <Container width="12rem">
                    <StyledLegal>
                      <StyledLegal.Title>{title}</StyledLegal.Title>
                      <StyledLegal.Status isLegal={legal === 'Legal'}>
                        {legal}
                      </StyledLegal.Status>
                    </StyledLegal>
                  </Container>
                ))}
              </Flex>
            </CardInfo>
          </Grid.Item>
          {variations.length > 0 && (
            <Grid.Item area="variations">
              <Text size={8} family="source sans">
                Variations
              </Text>
              <Flex alignItems="center" justifyContent="start">
                {variations.map(variant => (
                  <CardImgContainer>
                    <a href={`/card/${variant.id}`} aria-label="View Variant">
                      <CardImg src={variant.imgUrl} alt={name} />
                    </a>
                  </CardImgContainer>
                ))}
              </Flex>
            </Grid.Item>
          )}
          {Object.values(card.rulings).length > 0 && (
            <Grid.Item area="rules">
              <Text size={8} family="source sans">
                Rulings
              </Text>
              <RulesContainer>
                {Object.values(card.rulings).map(({ date, text }) => (
                  <StyledRule>
                    <Text isItalics color="grey" size={2} shade={6}>
                      {formatDate(date, {})}
                    </Text>
                    <Text family="Open Sans" lineHeight={1.7}>
                      {text}
                    </Text>
                  </StyledRule>
                ))}
              </RulesContainer>
            </Grid.Item>
          )}
        </Grid>
      ) : (
        <h1>...Loading</h1>
      )}
    </Page>
  )
}
