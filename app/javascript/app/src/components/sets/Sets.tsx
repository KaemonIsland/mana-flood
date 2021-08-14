import React, { ReactElement } from 'react'
import { Text, Container, Flex } from 'warlock-ui'
import styled from 'styled-components'
import { CardSet } from '../../interface'
import { SetIcon } from '../icon'

const SetGrid = styled.section(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spaceScale(4),
  gridTemplateColumns: `repeat(auto-fill, minmax(${theme.spaceScale(
    11
  )}, ${theme.spaceScale(12)}))`,
  justifyContent: 'space-between',
}))

const SetContainer = styled.a(({ theme }) => ({
  textDecoration: 'none',
  padding: theme.spaceScale(2),
  border: `1px solid ${theme.color.purple[8]}`,
  width: theme.spaceScale(12),
  boxShadow: theme.boxShadow.single[1],
  backgroundColor: 'white',
  borderRadius: theme.spaceScale(2),
  transition: 'all 200ms ease-in-out',
  display: 'flex',
  alignItems: 'center',

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

interface SetsProps {
  sets: Array<CardSet>
  link: string
  showAddInfo?: boolean
}

export const Sets = ({
  sets,
  link,
  showAddInfo = false,
}: SetsProps): ReactElement => {
  return (
    <SetGrid>
      {sets.map(({ id, name, keyruneCode, baseSetSize, unique }: CardSet) => (
        <>
          <SetContainer key={id} href={`${link}/${id}`}>
            <div
              style={{
                alignItems: 'center',
                width: '100%',
                height: showAddInfo ? '100%' : 'auto',
                display: 'flex',
              }}
            >
              <Container paddingRight={5}>
                <SetIcon setCode={keyruneCode} size={2} />
              </Container>
              <div
                style={{
                  justifyContent: 'space-between',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Text size={5} display="block">
                  {name}
                </Text>
                {showAddInfo && (
                  <Container width="100%">
                    <hr />
                    <Text font="roboto" display="block">
                      {`Cards: ${unique && `${unique} / `}${baseSetSize}`}
                    </Text>
                  </Container>
                )}
              </div>
            </div>
          </SetContainer>
        </>
      ))}
    </SetGrid>
  )
}
