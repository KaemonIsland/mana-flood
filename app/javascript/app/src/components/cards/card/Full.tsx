import React, { useState, useEffect, ReactElement } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Text, Container, Flex, Grid } from 'warlock-ui'
import { ManaSymbol } from '../../ManaSymbol'
import { getCardImage, useCards, formatDate, toCamelcase } from '../../../utils'
import { Page } from '../../page'
import { Ruling, Card } from '../../../interface'
import { ActionButtons } from '../../buttons'

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
  minWidth: '14rem',
  width: '100%',
  maxWidth: '22rem',
  marginRight: theme.spaceScale(4),
  borderRadius: theme.spaceScale(4),
  overflow: 'hidden',
  boxShadow: theme.boxShadow.single[2],
}))

const CardImg = styled.img(() => ({
  maxWidth: '100%',
  width: '100%',
  height: '100%',
}))

const StyledLegal = styled.div(({ theme }) => ({
  fontFamily: 'Roboto',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'start',
  padding: theme.spaceScale(2),
  width: theme.spaceScale(11),
}))

StyledLegal.Title = styled.p(({ theme, isLegal }) => ({
  display: 'inline-block',
  textTransform: 'uppercase',
  width: '100%',
  fontSize: theme.fontScale(2),
  border: `1px solid ${theme.color[isLegal ? 'green' : 'red'][6]}`,
  borderRadius: `${theme.spaceScale(1)} 0 0 ${theme.spaceScale(1)}`,
  padding: `${theme.spaceScale(1)} ${theme.spaceScale(2)}`,
}))

StyledLegal.Status = styled.p(({ theme, isLegal }) => ({
  fontWeight: 'bold',
  fontSize: theme.fontScale(2),
  backgroundColor: theme.color[isLegal ? 'green' : 'red'][6],
  border: `1px solid ${theme.color[isLegal ? 'green' : 'red'][6]}`,
  borderRadius: `0 ${theme.spaceScale(1)} ${theme.spaceScale(1)} 0`,
  padding: `${theme.spaceScale(1)} ${theme.spaceScale(2)}`,
  color: 'white',
}))

interface Props {
  id: number
}

const defaultCard: Card = {
  isAlternative: false,
  isPromo: false,
  id: 0,
  name: '',
  colorIdentity: '',
  scryfallId: '',
  manaCost: '',
  power: 0,
  toughness: 0,
  cardType: '',
  artist: '',
  rulings: [],
  legalities: {},
  flavorText: '',
  text: '',
  number: 0,
  rarity: '',
  collection: 0,
  variations: [],
  convertedManaCost: 0,
}

export const Full = ({ id }: Props): ReactElement => {
  const { actions, scope, deck } = useCards('collection')
  const [img, setImg] = useState('')
  const [variations, setVariations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [
    {
      power,
      toughness,
      cardType,
      artist,
      manaCost,
      collection,
      text,
      flavorText,
      legalities,
      rulings,
      rarity,
      number,
      name,
    },
    setCard,
  ] = useState(defaultCard)

  const quantity = collection
  const { add, update, remove } = actions

  const getVariationInfo = async (card: Card): Promise<void> => {
    let newVariations = card.variations
    if (newVariations) {
      newVariations = await Promise.all(
        card.variations.map(async variant => ({
          ...variant,
          imgUrl: await getCardImage(variant.scryfallId, 'large'),
        }))
      )
    }

    setVariations(newVariations)
  }

  const addCard = async (): Promise<void> => {
    const updatedCard: Card = await add(id, deck && deck.id)

    setCard(updatedCard)
  }

  const removeCard = async (): Promise<void> => {
    setCard(await remove(id, deck && deck.id))
  }

  const updateCard = async (newQuantity: number): Promise<void> => {
    setCard(await update(id, newQuantity, deck && deck.id))
  }

  const getCard = async (): Promise<Card> => {
    try {
      const response = await axios(`/api/v1/card/${id}`)

      const cardData: Card = toCamelcase(response.data)

      if (cardData) {
        return cardData
      } else {
        throw new Error()
      }
    } catch (error) {
      console.log('Unable to get card: ', error)
    }
  }

  const initialize = async (): Promise<void> => {
    const newCard: Card = await getCard()
    const cardUrl = await getCardImage(newCard.scryfallId, 'large')

    getVariationInfo(newCard)

    setCard(newCard)
    setImg(cardUrl)

    setIsLoading(false)
  }

  // Formats the cards mana cost for us to easily use mana symbol svgs
  const formattedMana = manaCost
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
          rowGap={7}
          templateAreas={[
            'name name name cmc',
            'mainImage actions info info',
            'mainImage legal legal legal',
            'variations variations variations variations',
            'rules rules rules rules',
          ]}
        >
          <Grid.Item area="name">
            <Text size={10} family="source sans">
              {name}
            </Text>
          </Grid.Item>
          <Grid.Item area="cmc" alignSelf="center" justifySelf="end">
            <Container width="20rem">
              <Flex alignItems="center" justifyContent="end">
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
                <span>Collection:</span>
                <ActionButtons
                  quantity={quantity}
                  actions={{ updateCard, addCard, removeCard }}
                />
              </Flex>
              <hr />
            </CardInfo>
          </Grid.Item>
          <Grid.Item area="info">
            <CardInfo>
              <Text isItalics>{cardType}</Text>
              <hr />
              <Container maxWidth="35rem">
                {text.split('\n').map((textLine, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    {textLine.replace(/[{}]/g, ' ')}
                  </div>
                ))}
              </Container>
              <hr />
              {power && (
                <>
                  <div>
                    {power} / {toughness}
                  </div>
                  <hr />
                </>
              )}
              {flavorText && (
                <>
                  <Text isItalics>&quot;{flavorText}&quot;</Text>
                  <hr />
                </>
              )}
              <div>
                Illustrated by{' '}
                <Text isItalics display="inline-block">
                  {artist}
                </Text>
              </div>
              <hr />
              <div>
                <Text isItalics display="inline-block">
                  {rarity}
                </Text>
                , {number}
              </div>
            </CardInfo>
          </Grid.Item>
          <Grid.Item area="legal">
            <CardInfo>
              <Flex flexWrap="wrap" alignItems="center" justifyContent="start">
                {Object.entries(legalities).map(([title, legal], i) => {
                  const isLegal = legal === 'Legal'
                  return (
                    <StyledLegal key={i}>
                      <StyledLegal.Title isLegal={isLegal}>
                        {title}
                      </StyledLegal.Title>
                      <StyledLegal.Status isLegal={isLegal}>
                        {legal}
                      </StyledLegal.Status>
                    </StyledLegal>
                  )
                })}
              </Flex>
            </CardInfo>
          </Grid.Item>
          {variations.length > 0 && (
            <Grid.Item area="variations">
              <Flex alignItems="center" justifyContent="start">
                {variations.map((variant, i) => (
                  <CardImgContainer key={i}>
                    <a href={`/card/${variant.id}`} aria-label="View Variant">
                      <CardImg src={variant.imgUrl} alt={name} />
                    </a>
                  </CardImgContainer>
                ))}
              </Flex>
            </Grid.Item>
          )}
          {Object.values(rulings).length > 0 && (
            <Grid.Item area="rules">
              <RulesContainer>
                {Object.values(rulings).map(({ date, text }: Ruling, i) => (
                  <StyledRule key={i}>
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
