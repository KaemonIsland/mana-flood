import React, { useState, useEffect, ReactElement, FormEvent } from 'react'
import { Text, Button, Flex } from 'warlock-ui'
import styled from 'styled-components'
import axios from 'axios'
import { collectionCardActions, formatDate } from '../utils'
import { Page, SetGroups, Collapse } from '../components'
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
  const [importContent, setImportContent] = useState(null)
  const [showOptions, setShowOptions] = useState(false)

  const getCollectionSets = async (): Promise<void> => {
    const sets = await collectionCardActions.sets()

    setCardSets(sets)
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    await axios.post('/api/v1/collection/import', {
      cards: importContent.cards,
      decks: importContent.decks,
    })
  }

  const handleChange = async e => {
    const file = e.files[0]
    const content = file && JSON.parse(await file.text())

    setImportContent(content)
  }

  useEffect(() => {
    getCollectionSets()
  }, [])

  return (
    <Page>
      <Flex alignItems="end" justifyContent="space-between">
        <Text size={10}>Collection</Text>
        <div>
          <Flex>
            <Button
              color="grey"
              shade={1}
              as="a"
              href="/api/v1/collection/export"
              download={`mtg_collection_${formatDate(new Date(), {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
              })}.json`}
              style={{ textDecoration: 'none', marginRight: '1rem' }}
            >
              Export
            </Button>
            <Button
              color="grey"
              shade={1}
              onClick={() => setShowOptions(!showOptions)}
            >
              Import
            </Button>
          </Flex>
        </div>
      </Flex>
      <Collapse isOpen={showOptions}>
        <Collapse.Content>
          <Form onSubmit={handleSubmit}>
            <File
              onChange={handleChange}
              label="Import Collection"
              name="collectionImport"
              accept="application/json"
              hint="Import a collection to Mana Flood"
            />
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                disabled={!importContent}
                color="purple"
                shade={4}
              >
                Submit
              </Button>
            </Flex>
          </Form>
        </Collapse.Content>
      </Collapse>
      <hr />
      <SetContainer href="/collection/all">
        <Text size={4} weight={500}>
          All Cards
        </Text>
      </SetContainer>
      <SetGroups
        sets={cardSets}
        setsOptions={{ link: '/collection/set', showAddInfo: true }}
      />
    </Page>
  )
}
