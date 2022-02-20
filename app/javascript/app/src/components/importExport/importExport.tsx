import React, { useState, FormEvent, ReactElement } from 'react'
import { Button, Flex } from 'warlock-ui'
import axios from 'axios'
import { Form, File } from '../../elements'
import { formatDate } from '../../utils'
import { Collapse } from '..'

export const ImportExport = (): ReactElement => {
  const [showOptions, setShowOptions] = useState(false)

  const [importContent, setImportContent] = useState(null)

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    await axios.post('/api/v1/collection/import', {
      cards: importContent.cards,
      decks: importContent.decks,
    })
  }

  const handleChange = async (e): Promise<void> => {
    const file = e.files[0]
    const content = file && JSON.parse(await file.text())

    setImportContent(content)
  }
  return (
    <>
      <Flex alignItems="end" justifyContent="space-between">
        <Flex.Item>
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
        </Flex.Item>
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
    </>
  )
}
