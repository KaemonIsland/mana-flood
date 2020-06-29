import React, { ReactElement } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { formatDate } from '../../utils'
import { CardSet } from '../../interface'
import { SetIcon } from '../icon'
import { useToasts } from '../toast'

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

const StyledFlex = styled.div(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
}))

interface SetsProps {
  sets: Array<CardSet>
  link: string
}

export const Sets = ({ sets, link }: SetsProps): ReactElement => {
  const {
    addToast,
    removeToast,
    removeAllToasts,
    updateToast,
    toasts,
  } = useToasts()
  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() =>
          addToast('Successfully added card', {
            appearance: 'success',
            autoDismiss: true,
          })
        }
      >
        Success
      </button>
      <button
        type="button"
        onClick={() =>
          addToast('Unable to remove card', {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      >
        Error
      </button>
      <button
        type="button"
        onClick={() =>
          addToast('You removed your last card', {
            appearance: 'warning',
            autoDismiss: true,
          })
        }
      >
        Warning
      </button>
      <button
        type="button"
        onClick={() =>
          addToast('That was cool!', {
            appearance: 'info',
            autoDismiss: true,
          })
        }
      >
        Info!
      </button>
      <SetGrid>
        {sets.map(
          ({
            id,
            baseSetSize,
            name,
            releaseDate,
            unique,
            keyruneCode,
          }: CardSet) => (
            <SetContainer key={id} href={`${link}/${id}`}>
              <Text size={5} display="block">
                {name}
              </Text>
              <Text
                as="span"
                font="roboto"
                display="block"
                color="grey"
                shade={6}
                size={1}
                isItalics
              >
                {formatDate(new Date(releaseDate), {})}
              </Text>
              <StyledFlex>
                <Text font="roboto" display="block">
                  {!!unique && `${unique} / `}
                  {baseSetSize} Cards
                </Text>
                <SetIcon setCode={keyruneCode} size="large" />
              </StyledFlex>
            </SetContainer>
          )
        )}
      </SetGrid>
    </React.Fragment>
  )
}
