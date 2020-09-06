import React, { ReactElement, useState, useEffect } from 'react'
import { Button, Flex, Container } from 'warlock-ui'
import { Deck } from '../../interface'
import { Form, Input, Textarea, Select } from '../../elements'

interface SubmitCallback {
  (a: Deck): void
}

interface CancelUpdate {
  (): void
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
  cancelUpdate: CancelUpdate
  disabled: boolean
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
  cancelUpdate,
  submitCallback,
  disabled,
}: FormProps): ReactElement => {
  const defaultForm = {
    name: '',
    description: '',
    format: '',
  }

  const [form, setForm] = useState(updateInfo || defaultForm)

  const handleSubmit = async (e): Promise<void> => {
    if (!disabled) {
      e.preventDefault()

      submitCallback(form)

      setForm(defaultForm)
    }
  }

  const handleChange = (e): void => {
    const { name, value } = e.target

    setForm(currentValue => ({
      ...currentValue,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (updateInfo) {
      setForm(updateInfo)
    } else {
      setForm(defaultForm)
    }
  }, [updateInfo])

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
        {updateInfo && (
          <Container marginRight={4}>
            <Button
              color="red"
              shade={6}
              variant="text"
              size="large"
              onClick={cancelUpdate}
            >
              Cancel
            </Button>
          </Container>
        )}
        <Container marginRight={4}>
          <Button
            color="grey"
            shade={6}
            variant="text"
            size="large"
            onClick={() => setForm(updateInfo || defaultForm)}
          >
            {updateInfo ? 'Reset' : 'Clear'}
          </Button>
        </Container>
        <Button
          color="purple"
          size="large"
          isDisabled={disabled || !form.name}
          shade={4}
          type="submit"
        >
          Submit
        </Button>
      </Flex>
    </Form>
  )
}
