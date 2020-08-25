import React, { useState, FormEvent, ReactElement } from 'react'
import { Button, Flex, Container } from 'warlock-ui'
import { Collapse } from '../collapse'
import { Form, Input } from '../../elements'

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
