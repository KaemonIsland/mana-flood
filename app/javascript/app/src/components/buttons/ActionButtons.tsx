import React, { ReactElement } from 'react'
import { Button, Flex } from 'warlock-ui'
import styled from 'styled-components'

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
  padding: ${({ theme }): string =>
    [theme.spaceScale(1), theme.spaceScale(2)].join(' ')};
`
Button.Right = styled(Button)`
  border-radius: ${({ theme, hasCard }): string =>
    hasCard ? '0 1rem 1rem 0' : theme.spaceScale(1)};
  background-color: transparent;
`

interface UpdateCard {
  (newQuantity: number): Promise<void>
}
interface AddCard {
  (): Promise<void>
}
interface RemoveCard {
  (): Promise<void>
}

interface Actions {
  updateCard: UpdateCard
  addCard: AddCard
  removeCard: RemoveCard
}

interface ActionButtonProps {
  actions: Actions
  quantity: number
}

export const ActionButtons = ({
  actions,
  quantity,
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
          -
        </Button.Left>
        <Button.Middle color="grey" shade={8} variant="outline" isDisabled>
          {quantity}
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
      +
    </Button.Right>
  </Flex>
)
