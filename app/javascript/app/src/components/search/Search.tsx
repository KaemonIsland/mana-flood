import React, { useState, FormEvent, ReactElement } from 'react'
import { Button, Flex, Container } from 'warlock-ui'
import { Collapse } from '../collapse'
import { Form, Input, Checkbox } from '../../elements'

interface Callback {
  (query: URLSearchParams): void
}

interface SearchProps {
  callback: Callback
}

const formatKey = (key): string => `q[${key}]`

const searchSettings = {
  cardName: 'name_cont',
  cardText: 'text_cont',
  cardType: 'card_type_or_subtypes_cont',
  manaCost: 'mana_cost_cont',
  artist: 'artist_cont',
  flavorText: 'flavor_text_cont',
}

export const Search = ({ callback }: SearchProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(true)
  const [form, setForm] = useState({})

  const buildQuery = () => {
    const query = new URLSearchParams()

    Object.entries(form).forEach(([key, value]) => {
      query.append(formatKey(searchSettings[key]), String(value))
    })

    return query
  }

  // TODO Allow the form to search for ANY part of card text, even out of order.

  const submitForm = (e: FormEvent): void => {
    e.preventDefault()

    const query = buildQuery()

    callback(query)

    setForm('')
  }

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(currentForm => ({
      ...currentForm,
      [name]: value,
    }))
  }

  return (
    <Form onSubmit={submitForm}>
      <Checkbox
        label="Colors"
        onChange={e => {
          console.log(e.target.value)
          console.log(e.target.name)
          console.log(e.target.checked)
        }}
        hint="select which colors to search by"
        name="colors"
        options={['White', 'Blue', 'Black', 'Red', 'Green']}
      />
      <Input
        label="Card Name"
        name="cardName"
        type="text"
        placeholder="name doesn't have to be exact"
        onChange={handleFormChange}
        value={form?.cardName || ''}
      />
      <Collapse isOpen={isOpen}>
        <Collapse.Content>
          <Input
            label="Card Text"
            name="cardText"
            type="text"
            placeholder="Text can match anything"
            onChange={handleFormChange}
            value={form?.cardText || ''}
          />
          <Input
            label="Card Type"
            name="cardType"
            type="text"
            placeholder="Text can match anything"
            onChange={handleFormChange}
            value={form?.cardType || ''}
          />
          <Input
            label="Mana Cost"
            name="manaCost"
            type="text"
            placeholder="Wrap colors within curly brackets {}"
            hint="Wrap colors within curly brackets. EX {1}{U/B}{W}"
            onChange={handleFormChange}
            value={form?.manaCost || ''}
          />
          <Input
            label="Artist"
            name="artist"
            type="text"
            placeholder="Text can match anything"
            onChange={handleFormChange}
            value={form?.artist || ''}
          />
          <Input
            label="Flavor Text"
            name="flavorText"
            type="text"
            placeholder="Text can match anything"
            onChange={handleFormChange}
            value={form?.flavorText || ''}
          />
        </Collapse.Content>
      </Collapse>
      <Flex alignItems="center" justifyContent="flex-end">
        <Container marginRight={4}>
          <Button
            color="purple"
            shade={6}
            variant="text"
            size="large"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide' : 'Show'} Advanced Search
          </Button>
        </Container>
        <Button color="yellow" size="large" shade={4} type="submit">
          Search
        </Button>
      </Flex>
    </Form>
  )
}
