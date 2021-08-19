import React, { ReactElement } from 'react'
import { Button, Flex, Text } from 'warlock-ui'
import styled from 'styled-components'
import { Feather } from '../icon'

Button.Left = styled(Button)`
  border-radius: 1rem 0 0 1rem;
  background-color: transparent;
`
Button.Middle = styled.div`
  border-radius: 0;
  background-color: transparent;
  border: 1px solid ${({ theme }): string => theme.color['grey'][8]};
  display: inline-block;
  text-align: center;
  letter-spacing: 0.1rem;
  padding: ${({ theme }): string =>
    [theme.spaceScale(1), theme.spaceScale(2)].join(' ')};
`
Button.Right = styled(Button)`
  border-radius: ${({ theme, hasCard }): string =>
    hasCard ? '0 1rem 1rem 0' : theme.spaceScale(1)};
  background-color: transparent;
`

interface UpdateCard {
  (newQuantity: number): void
}
interface AddCard {
  (): void
}
interface RemoveCard {
  (): void
}

interface Actions {
  updateCard: UpdateCard
  addCard: AddCard
  removeCard: RemoveCard
}

interface ActionButtonProps {
  actions: Actions
  quantity: number
  collection?: number
}

/**
 * Button group for updating card quantity.
 *
 * actions - Add/Update/Delete card action functions
 * quantity - The current card quantity within the scope
 * collection - The total cards in collection (only shows if collection is present)
 */
export const ActionButtons = ({
  actions,
  quantity,
  collection,
}: ActionButtonProps): ReactElement => (
  <Flex alignItems="center" justifyContent="end">
    {!!quantity && (
      <>
        <Button.Left
          color="grey"
          shade={8}
          size="small"
          variant="outline"
          bubble={false}
          isDisabled={!quantity}
          onClick={(): void => {
            const newQuantity = quantity - 1
            if (newQuantity) {
              actions.updateCard(newQuantity)
            } else {
              actions.removeCard()
            }
          }}
        >
          <Feather icon="minus" size="small" />
        </Button.Left>
        <Button.Middle color="grey" shade={8} variant="outline" isDisabled>
          <Text family="roboto" display="inline-block">
            {quantity}
          </Text>
          {collection ? (
            <Text
              family="roboto"
              display="inline-block"
              color="grey"
              shade={6}
              size={2}
            >{`/${collection}`}</Text>
          ) : null}
        </Button.Middle>
      </>
    )}
    <Button.Right
      hasCard={quantity}
      color="grey"
      shade={8}
      size="small"
      bubble={false}
      variant="outline"
      onClick={(): void => {
        if (quantity) {
          actions.updateCard(quantity + 1)
        } else {
          actions.addCard()
        }
      }}
    >
      <Feather icon="plus" size="small" />
    </Button.Right>
  </Flex>
)
