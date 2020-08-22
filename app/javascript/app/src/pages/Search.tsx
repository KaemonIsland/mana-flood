import React, { ReactElement, useState } from 'react'
import { Text, Button } from 'warlock-ui'
import { Page, Cards, Collapse } from '../components'

export const Search = (): ReactElement => {
  const [query, setQuery] = useState(new URLSearchParams('q[name_cont]=jace'))
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState('')

  const handleFormChange = e => {
    const { target, value } = e.target

    setForm(value)
  }

  const submitForm = () => {
    setQuery(new URLSearchParams(`q[name_cont]=${form}`))
    setForm('')
  }

  return (
    <Page>
      <Text size={10}>Search</Text>
      <Collapse isOpen={isOpen} color="purple" shade={3}>
        <Collapse.Header>
          <Button color="purple" shade={1} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Hide' : 'Show'} Search
          </Button>
        </Collapse.Header>
        <Collapse.Content>
          <label>
            Search by name or content
            <input type="text" value={form} onChange={handleFormChange} />
          </label>
          <Button color="blue" shade={1} onClick={() => submitForm()}>
            Search
          </Button>
        </Collapse.Content>
      </Collapse>
      <hr />
      <Cards type="search" options={{ query }} />
    </Page>
  )
}
