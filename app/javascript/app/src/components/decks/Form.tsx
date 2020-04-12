import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'warlock-ui'
import axios from 'axios'

const StyledForm = styled.form(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
}))

const StyeledLabel = styled.label(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}))

/**
 * Form for updating/creating decks.
 * Send the updateInfo attribute if we are updating a current deck.
 * Otherwise, we will create a new one.
 */
export const Form = ({ updateInfo, submitCallback }): ReactElement => {
  const defaultForm = {
    name: '',
    description: '',
    format: 'standard',
  }

  const [form, setForm] = useState(updateInfo?.name ? updateInfo : defaultForm)

  const createDeck = async () => {
    try {
      const response = await axios.post('api/v1/decks', form)

      submitCallback(response?.data)
      console.log('Response: ', response)
    } catch (error) {
      console.log('Unable to create deck: ', error)
    }
  }

  const updateDeck = async () => {
    try {
      const response = await axios.patch(`api/v1/decks/${updateInfo?.id}`, form)

      submitCallback(response?.data)
      console.log('Response: ', response)
    } catch (error) {
      console.log('Unable to update deck: ', error)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (updateInfo?.id) {
      updateDeck()
    } else {
      createDeck()
    }
    setForm(defaultForm)
  }

  const handleChange = e => {
    const { name, value } = e.target

    setForm(currentValue => ({
      ...currentValue,
      [name]: value,
    }))
  }
  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyeledLabel>
        Deck Name:
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
        />
      </StyeledLabel>
      <StyeledLabel>
        Description:
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </StyeledLabel>
      <StyeledLabel>
        Format:
        <select value={form.format} name="format" onChange={handleChange}>
          <option value="standard">Standard</option>
          <option value="modern">Modern</option>
          <option value="commander">Commander</option>
          <option value="legacy">Legacy</option>
          <option value="vintage">Vintage</option>
          <option value="brawl">Brawl</option>
          <option value="block">Block</option>
          <option value="two-headed-giant">Two Headed Giant</option>
          <option value="pauper">Pauper</option>
          <option value="pioneer">Pioneer</option>
        </select>
      </StyeledLabel>
      <Button type="submit" color="purple" variant="filled" shade={4}>
        Submit
      </Button>
    </StyledForm>
  )
}
