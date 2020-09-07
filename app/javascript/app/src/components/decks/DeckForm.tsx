import React, { ReactElement, useState } from 'react'
import { Button, Flex, Container } from 'warlock-ui'
import { Form, Input, Textarea, Select } from '../../elements'
import { Deck } from '../../interface'

interface SubmitCallback {
  (a: any): void
}

interface FormProps {
  submitCallback: SubmitCallback
  deck?: Deck | null
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
  submitCallback,
  deck = null,
}: FormProps): ReactElement => {
  const defaultForm = {
    name: (deck && deck.name) || '',
    description: (deck && deck.description) || '',
    format: (deck && deck.format) || '',
  }

  const [form, setForm] = useState(defaultForm)

  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault()

    submitCallback(form)

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
      <Flex alignItems="center" justifyContent="flex-end">
        <Container marginRight={4}>
          <Button
            color="grey"
            shade={6}
            variant="text"
            size="large"
            onClick={() => setForm(defaultForm)}
          >
            Clear
          </Button>
        </Container>
        <Button
          color="purple"
          size="large"
          isDisabled={!form.name}
          shade={4}
          type="submit"
        >
          Submit
        </Button>
      </Flex>
    </Form>
  )
}
