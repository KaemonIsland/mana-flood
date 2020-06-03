import React, { useEffect, useState, ReactElement } from 'react'
import { Flex, Button } from 'warlock-ui'
import styled from 'styled-components'

const PaginationContainer = styled.div(({ theme }) => ({
  width: '100%',
  maxWidth: theme.spaceScale(16),
  margin: `${theme.spaceScale(4)} auto`,
}))

const PageButton = styled(Button)(({ theme, isDisabled }) => ({
  width: theme.spaceScale(7),
  border: isDisabled && '1px solid transparent',
  borderRadius: 0,
}))

PageButton.Left = styled(Button)(({ theme, isDisabled }) => ({
  border: isDisabled && '1px solid transparent',
  borderRadius: `${theme.spaceScale(2)} 0 0 ${theme.spaceScale(2)}`,
}))

PageButton.Right = styled(Button)(({ theme, isDisabled }) => ({
  border: isDisabled && '1px solid transparent',
  borderRadius: `0 ${theme.spaceScale(2)} ${theme.spaceScale(2)} 0`,
}))

interface Prev {
  (): void
}
interface Next {
  (): void
}

interface SetPage {
  (page: number): void
}

interface PaginationProps {
  prev: Prev
  next: Next
  page: number
  totalPages: number
  setPage: SetPage
}

export const Pagination = ({
  prev,
  next,
  page,
  totalPages,
  setPage,
}: PaginationProps): ReactElement => {
  const [pageRange, setPageRange] = useState([])

  useEffect(() => {
    const buildPageRange = (): Array<number> => {
      let newPageRange = [page - 1, page, page + 1]

      if (page === 0) {
        newPageRange = [page + 1, page + 2]
      }

      if (page === totalPages) {
        newPageRange = [page - 2, page - 1]
      }

      return newPageRange.filter(page => page > 0 && page < totalPages)
    }
    setPageRange(buildPageRange())
  }, [page, totalPages])
  return (
    <PaginationContainer>
      <Flex alignItems="start" justifyContent="center">
        <PageButton.Left
          type="button"
          color="grey"
          shade={8}
          onClick={prev}
          variant="outline"
          isDisabled={!page}
        >
          Previous
        </PageButton.Left>
        <PageButton
          type="button"
          color="grey"
          shade={8}
          onClick={(): void => setPage(0)}
          variant="outline"
          isDisabled={page === 0}
        >
          {1}
        </PageButton>
        {pageRange[0] > 1 && (
          <PageButton type="button" color="grey" shade={8} variant="outline">
            ...
          </PageButton>
        )}
        {pageRange.map(pageNumber => (
          <PageButton
            key={pageNumber}
            type="button"
            color="grey"
            shade={8}
            onClick={(): void => setPage(pageNumber)}
            variant="outline"
            isDisabled={page === pageNumber}
          >
            {pageNumber + 1}
          </PageButton>
        ))}
        {pageRange[pageRange.length - 1] + 1 < totalPages && (
          <PageButton type="button" color="grey" shade={8} variant="outline">
            ...
          </PageButton>
        )}
        {totalPages !== 0 && (
          <PageButton
            type="button"
            color="grey"
            shade={8}
            onClick={(): void => setPage(totalPages)}
            variant="outline"
            isDisabled={page === totalPages}
          >
            {totalPages + 1}
          </PageButton>
        )}
        <PageButton.Right
          type="button"
          color="grey"
          shade={8}
          onClick={next}
          variant="outline"
          isDisabled={page === totalPages}
        >
          Next
        </PageButton.Right>
      </Flex>
    </PaginationContainer>
  )
}
