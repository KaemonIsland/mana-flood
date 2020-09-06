import React, { ReactElement, useState } from 'react'
import { Button } from 'warlock-ui'
import { deckActions } from '../../utils'
import { Deck } from '../../interface'
import { Form, Input, Textarea, Select } from '../../elements'

interface SubmitCallback {
  (a: Deck): void
}

interface DeckInfo {
  id?: number
  name?: string
  format?: string
  description?: string
}

interface FormProps {
  updateInfo: DeckInfo
  submitCallback: SubmitCallback
}

const formats = [
  '',
  'standard',
  'modern',
  'commander',
  'legacy',
  'vintage',
  'brawl',
  'pauper',
  'casual',
  'pioneer',
  'penny',
  'duel',
  'future',
  'historic',
]

/**
 * Form for updating/creating decks.
 * Send the updateInfo attribute if we are updating a current deck.
 * Otherwise, we will create a new one.
 */
export const DeckForm = ({
  updateInfo,
  submitCallback,
}: FormProps): ReactElement => {
  const defaultForm = {
    name: '',
    description: '',
    format: '',
  }

  const [form, setForm] = useState(updateInfo?.name ? updateInfo : defaultForm)

  const createDeck = async (): Promise<void> => {
    const deck = await deckActions.create(form)

    submitCallback(deck)
  }

  const updateDeck = async (): Promise<void> => {
    const updatedDeck = await deckActions.update(updateInfo?.id, form)

    submitCallback(updatedDeck)
  }

  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault()
    if (updateInfo?.id) {
      updateDeck()
    } else {
      createDeck()
    }
    setForm(defaultForm)
  }

  const handleChange = (e): void => {
    const { name, value } = e.target

    setForm(currentValue => ({
      ...currentValue,
      [name]: value,
    }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="name"
        type="text"
        placeholder="Deck Name"
        label="name"
        value={form.name || ''}
        onChange={handleChange}
        removeHint
      />
      <Textarea
        name="description"
        placeholder="How does the deck win?"
        label="description"
        value={form.description || ''}
        onChange={handleChange}
        hint="How does the deck win?"
      />
      <Select
        label="format"
        name="format"
        value={form.format || ''}
        onChange={handleChange}
        options={formats.map(format => ({ value: format }))}
        hint="What format will this be played in?"
      />
      <Button type="submit" color="purple" variant="filled" shade={4}>
        Submit
      </Button>
    </Form>
  )
}
