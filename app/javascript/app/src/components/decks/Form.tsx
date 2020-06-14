import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'warlock-ui'
import axios from 'axios'
import { toCamelcase } from '../../utils'
import { Deck } from '../../interface'

const StyledForm = styled.form(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
}))

const StyledLabel = styled.label(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

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

/**
 * Form for updating/creating decks.
 * Send the updateInfo attribute if we are updating a current deck.
 * Otherwise, we will create a new one.
 */
export const Form = ({
  updateInfo,
  submitCallback,
}: FormProps): ReactElement => {
  const defaultForm = {
    name: '',
    description: '',
    format: 'standard',
  }

  const [form, setForm] = useState(updateInfo?.name ? updateInfo : defaultForm)

  const createDeck = async (): Promise<void> => {
    try {
      const response = await axios.post('api/v1/decks', form)

      submitCallback(toCamelcase(response?.data))
    } catch (error) {
      console.log('Unable to create deck: ', error)
    }
  }

  const updateDeck = async (): Promise<void> => {
    try {
      const response = await axios.patch(`api/v1/decks/${updateInfo?.id}`, form)

      submitCallback(toCamelcase(response?.data))
    } catch (error) {
      console.log('Unable to update deck: ', error)
    }
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
    <StyledForm onSubmit={handleSubmit}>
      <StyledLabel>
        Deck Name:
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
        />
      </StyledLabel>
      <StyledLabel>
        Description:
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </StyledLabel>
      <StyledLabel>
        Format:
        <select value={form.format} name="format" onBlur={handleChange}>
          <option value="standard">Standard</option>
          <option value="modern">Modern</option>
          <option value="commander">Commander</option>
          <option value="legacy">Legacy</option>
          <option value="vintage">Vintage</option>
          <option value="brawl">Brawl</option>
          <option value="pauper">Pauper</option>
          <option value="casual">Casual</option>
          <option value="pioneer">Pioneer</option>
          <option value="penny">Penny</option>
          <option value="duel">Duel</option>
          <option value="future">Future</option>
          <option value="historic">Historic</option>
        </select>
      </StyledLabel>
      <Button type="submit" color="purple" variant="filled" shade={4}>
        Submit
      </Button>
    </StyledForm>
  )
}
