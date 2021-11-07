import React, { ReactElement, useState } from 'react'
import { Button, Flex, Text, Container } from 'warlock-ui'
import { CheckboxConfirm } from '../../elements'
import styled from 'styled-components'

interface UpdateCard {
  (newQuantity: number, options?: any): void
}
interface AddCard {
  (options?: any): void
}
interface RemoveCard {
  (options?: any): void
}

interface Actions {
  updateCard: UpdateCard
  addCard: AddCard
  removeCard: RemoveCard
}

interface ActionButtonProps {
  actions: Actions
  quantity: number
  collection?: any
  foil?: number
}

/**
 * A form that adds/updates/removes cards from a collection.
 *
 * Allows additional options like foil.
 *
 * actions - Add/Update/Delete card action functions
 * quantity - The current card quantity within the scope
 * collection - The total cards in collection (only shows if collection is present)
 */
export const AddCardForm = ({
  actions,
  quantity,
  foil,
}: ActionButtonProps): ReactElement => {
  const [isFoil, setIsFoil] = useState(false)

  // TODO make this form actually look good!
  return (
    <Container padding={4} paddingRight={0}>
      {foil && (
        <Text family="roboto" display="inline-block">
          {`Foil: ${foil}`}
        </Text>
      )}
      <Text family="roboto" display="inline-block">
        {`Quantity: ${quantity ? quantity : 'Not Owned'}`}
      </Text>
      <Container width="10rem">
        <CheckboxConfirm
          label="Is Foil?"
          removeHint
          value={isFoil}
          onChange={() => {
            setIsFoil(!isFoil)
          }}
        />
        <Flex alignItems="center" justifyContent="space-between">
          <Button
            color="grey"
            shade={8}
            size="small"
            variant="outline"
            bubble={false}
            isDisabled={!quantity}
            onClick={(): void => {
              const newQuantity = quantity - 1
              if (newQuantity) {
                actions.updateCard(
                  newQuantity,
                  isFoil ? { params: { foil: foil - 1 } } : null
                )
              } else {
                actions.removeCard()
              }
            }}
          >
            Remove
          </Button>

          <Button
            hasCard={quantity}
            color="grey"
            shade={8}
            size="small"
            bubble={false}
            variant="outline"
            onClick={(): void => {
              if (quantity) {
                actions.updateCard(
                  quantity + 1,
                  isFoil ? { params: { foil: foil + 1 } } : null
                )
              } else {
                actions.addCard(isFoil ? { params: { foil: 1 } } : null)
              }
            }}
          >
            Add
          </Button>
        </Flex>
      </Container>
    </Container>
  )
}
