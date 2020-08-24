import React, { useState, FormEvent, ReactElement } from 'react'
import { Button, Flex, Container } from 'warlock-ui'
import { Collapse } from '../collapse'
import { Form, Input } from '../../elements'

interface Callback {
  (query: string): void
}

interface SearchProps {
  callback: Callback
}

export const Search = ({ callback }: SearchProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(true)
  const [form, setForm] = useState('')

  const submitForm = (e: FormEvent): void => {
    e.preventDefault()

    callback(`q[name_cont]=${form}`)

    setForm('')
  }

  const handleFormChange = e => {
    const { target, value } = e.target

    setForm(value)
  }

  return (
    <Form onSubmit={submitForm}>
      <Input
        label="Card Name"
        name="cardName"
        type="text"
        placeholder="name doesn't have to be exact"
        onChange={handleFormChange}
        value={form}
      />
      <Collapse isOpen={isOpen}>
        <Collapse.Content>
          <Input
            label="Card Text"
            name="cardText"
            type="text"
            placeholder="Text can match anything"
            onChange={handleFormChange}
            value={form}
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
