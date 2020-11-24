import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { Text, Container, Flex, Grid, Button } from 'warlock-ui'
import { Link } from '../../link'
import { ManaSymbol } from '../../icon'
import { formatDate, cardActions, getManaCost } from '../../../utils'
import { Scope } from '../../'
import { useScope } from '../../../providers'
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

const LegalContainer = styled.div(({ theme }) => ({
  height: theme.spaceScale(9),
  overflowY: 'scroll',
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

interface Price {
  usd: number
  usdFoil: number
}

interface CardVariant {
  id: string
  imgUrl: string
}

interface Props {
  card: Card
  img: string
  variations: Array<CardVariant>
  prices: Price
  setCard: any
}

export const Full = ({
  card,
  img,
  variations,
  prices,
  setCard,
}: Props): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 650 })
  const isTablet = useMediaQuery({ maxWidth: 950, minWidth: 651 })
  const { currentScope, scopes, updateScope } = useScope()
  const scope = typeof currentScope === 'string' ? 'collection' : 'deck'
  const deckId = (typeof currentScope !== 'string' && currentScope.id) || null

  const {
    id,
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
    loyalty,
    tcgplayerProductId,
    deck,
  } = card

  const quantity = scope === 'collection' ? collection : deck

  const { add, update, remove } = cardActions[scope]

  const addCard = async (): Promise<void> => {
    const updatedCard: Card = await add(id, deckId)

    setCard(updatedCard)
  }

  const removeCard = async (): Promise<void> => {
    setCard(await remove(id, deckId))
  }

  const updateCard = async (newQuantity: number): Promise<void> => {
    setCard(await update(id, newQuantity, deckId))
  }

  const formattedMana = getManaCost(manaCost)

  const tabletGrid = {
    templateColumns: Grid.repeat(2, Grid.fr(1)),
    templateAreas: [
      'name cmc',
      'mainImage info',
      'actions legal',
      'variations variations',
      'rules rules',
    ],
  }

  const mobileGrid = {
    templateColumns: Grid.fr(1),
    alignItems: 'center',
    rowGap: 4,
    templateAreas: [
      'cmc',
      'name',
      'mainImage',
      'actions',
      'info',
      'legal',
      'variations',
      'rules',
    ],
  }

  return (
    <Grid
      justifyContent="center"
      alignItems="start"
      templateColumns={Grid.repeat(4, Grid.fr(1))}
      templateRows="auto"
      rowGap={7}
      templateAreas={[
        'name name name cmc',
        'mainImage actions info info',
        'legal legal legal legal',
        'variations variations variations variations',
        'rules rules rules rules',
      ]}
      {...(isMobile && mobileGrid)}
      {...(isTablet && tabletGrid)}
    >
      <Grid.Item area="cmc" justifySelf={isMobile ? 'start' : 'end'}>
        <Flex alignItems="center" justifyContent="end">
          {formattedMana.length !== 0 &&
            formattedMana.map((mana, i) => (
              <ManaSymbol
                size={
                  (isMobile && 'medium') || (isTablet && 'large') || 'xLarge'
                }
                key={i}
                mana={mana}
              />
            ))}
        </Flex>
      </Grid.Item>
      <Grid.Item area="name">
        <Text as="h1" size={isMobile || isTablet ? 7 : 10} family="source sans">
          {name}
        </Text>
      </Grid.Item>
      <Grid.Item area="mainImage" justifySelf={isMobile ? 'center' : 'start'}>
        <CardImgContainer>
          <CardImg src={img} alt={name} />
        </CardImgContainer>
      </Grid.Item>
      <Grid.Item area="actions">
        <CardInfo>
          <Container marginBottom={5}>
            <Flex alignItems="start">
              <Scope
                currentScope={currentScope}
                scopes={scopes}
                updateScope={updateScope}
              />
              <ActionButtons
                collection={scope !== 'collection' ? collection : null}
                quantity={quantity}
                actions={{ updateCard, addCard, removeCard }}
              />
            </Flex>
          </Container>
          <Container marginBottom={4}>
            <Flex justifyContent="space-between" alignItems="start">
              <p>Normal</p>
              <Text size={6} family="roboto">
                ${Number(prices.usd).toFixed(2)}
              </Text>
            </Flex>
          </Container>

          <Container marginBottom={4}>
            <Flex justifyContent="space-between" alignItems="start">
              <p>Foil</p>
              <Text size={6} family="roboto">
                ${Number(prices.usdFoil).toFixed(2)}
              </Text>
            </Flex>
          </Container>
          <Flex justifyContent="center">
            <Button color="purpleVivid" shade={2}>
              <Link
                target="_blank"
                href={`https://shop.tcgplayer.com/product/productsearch?id=${tcgplayerProductId}`}
              >
                Get it on tcgplayer
              </Link>
            </Button>
          </Flex>
        </CardInfo>
      </Grid.Item>
      <Grid.Item area="info">
        <CardInfo>
          <Text isItalics>{cardType}</Text>
          <hr />
          <Container maxWidth="35rem">
            {text.split('\n').map((textLine, i) => (
              <Text
                family="source sans pro"
                key={i}
                style={{ marginBottom: '0.5rem' }}
              >
                {textLine.replace(/[{}]/g, ' ')}
              </Text>
            ))}
          </Container>
          <hr />
          {flavorText && (
            <>
              <Text isItalics>&quot;{flavorText}&quot;</Text>
              <hr />
            </>
          )}
          {power && (
            <>
              <Text family="roboto" isBold>
                {power} / {toughness}
              </Text>
              <hr />
            </>
          )}
          {loyalty && (
            <>
              <Text family="roboto" isBold>
                {loyalty}
              </Text>
              <hr />
            </>
          )}
          <div>
            <Text size={2} display="inline-block">
              Illustrated by{' '}
              <Text size={2} as="span" isItalics display="inline-block">
                {artist}
              </Text>
            </Text>
          </div>
          <hr />
          <div>
            <Text isItalics display="inline-block">
              {rarity}
            </Text>
            , #{number}
          </div>
        </CardInfo>
      </Grid.Item>
            {Object.entries(legalities.split(',')).length > 1 && (
      <Grid.Item area="legal">
        <CardInfo>
          <LegalContainer>
            <Flex
              flexWrap="wrap"
              alignItems="center"
              justifyContent={isMobile || isTablet ? 'center' : 'start'}
            >
              {Object.entries(legalities.split(',')).map(([title, legal], i) => {
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
          </LegalContainer>
        </CardInfo>
      </Grid.Item>
              )}
      {variations.length > 0 && (
        <Grid.Item area="variations">
          <Flex
            alignItems="center"
            justifyContent={isMobile ? 'center' : 'start'}
            flexWrap="wrap"
            direction={isMobile ? 'column' : 'row'}
          >
            {variations.map((variant, i) => (
              <CardImgContainer style={{ marginBottom: '1rem' }} key={i}>
                <a href={`/card/${variant.id}`} aria-label="View Variant">
                  <CardImg src={variant.imgUrl} alt={name} />
                </a>
              </CardImgContainer>
            ))}
          </Flex>
        </Grid.Item>
      )}
      {/*Object.values(rulings.split(',')).length > 1 && (
        <Grid.Item area="rules">
          <RulesContainer>
            {rulings.split(',').map(({ date, text }: Ruling, i) => (
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
            )*/}
    </Grid>
  )
}
