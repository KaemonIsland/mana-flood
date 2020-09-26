import React, {
  useState,
  useEffect,
  ReactElement,
  FormEvent,
  useRef,
} from 'react'
import { Text, Button } from 'warlock-ui'
import styled from 'styled-components'
import axios from 'axios'
import { cardActions, formatDate } from '../utils'
import { Page, Sets, Collapse } from '../components'
import { Form, File } from '../elements'

const SetContainer = styled.a(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spaceScale(3),
  textDecoration: 'none',
  color: 'black',
  textTransform: 'uppercase',
  padding: theme.spaceScale(2),
  border: `1px solid ${theme.color.purple[8]}`,
  textAlign: 'center',
  boxShadow: theme.boxShadow.single[1],
  backgroundColor: 'white',
  borderRadius: theme.spaceScale(2),
  transition: 'all 200ms ease-in-out',
  '&:hover, &:focus': {
    backgroundColor: theme.color.purple[2],
    transform: 'translateY(-4px)',
    boxShadow: theme.boxShadow.single[2],
  },
  '&:active': {
    backgroundColor: theme.color.purple[2],
    transform: 'translateY(-2px)',
    boxShadow: theme.boxShadow.single[1],
  },
}))

export const Collection = (): ReactElement => {
  const [cardSets, setCardSets] = useState([])

  const getCollectionSets = async (): Promise<void> => {
    const sets = await cardActions.collection.sets()

    setCardSets(sets)
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const file = fileInput.current && fileInput.current.files[0]
    const content = file && JSON.parse(await file.text())

    await axios.post('/api/v1/collection/import', {
      cards: content.cards,
    })
  }

  const handleChange = async e => {
    const file = e.files[0]
    const content = file && JSON.parse(await file.text())

    console.log({ file, content })
  }

  useEffect(() => {
    getCollectionSets()
  }, [])

  return (
    <Page>
      <Text size={10}>Collection</Text>
      <a
        href="/api/v1/collection/export"
        download={`mtg_collection_${formatDate(new Date(), {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })}.json`}
      >
        Export Collection
      </a>
      <Collapse isOpen={true}>
        <Collapse.Content>
          <Form onSubmit={handleSubmit}>
            <File
              onChange={handleChange}
              label="Import Collection"
              name="collectionImport"
              accept="application/json"
              hint="Import a collection to Mana Flood"
            />
            <Button type="submit" color="purple" shade={4}>
              Submit
            </Button>
          </Form>
        </Collapse.Content>
      </Collapse>
      <hr />
      <SetContainer href="/collection/all">
        <Text size={4} weight={500}>
          All Cards
        </Text>
      </SetContainer>
      <Sets sets={cardSets} link="/collection/set" />
    </Page>
  )
}
