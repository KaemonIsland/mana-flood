import React, { useState, FormEvent, ReactElement } from 'react'
import { Button } from 'warlock-ui'
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
    <Collapse isOpen={isOpen} color="purple" shade={3}>
      <Collapse.Header>
        <Button color="purple" shade={1} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide' : 'Show'} Search
        </Button>
      </Collapse.Header>
      <Collapse.Content>
        <Form onSubmit={submitForm}>
          <Input
            label="Card Name"
            name="name"
            type="text"
            placeholder="name doesn't have to be exact"
            onChange={handleFormChange}
            value={form}
          />
          <Button color="blue" shade={1} type="submit">
            Search
          </Button>
        </Form>
      </Collapse.Content>
    </Collapse>
  )
}
