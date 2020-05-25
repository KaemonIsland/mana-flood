import React from 'react'
import { Flex, Button } from 'warlock-ui'
import styled from 'styled-components'

const PaginationContainer = styled.div(({ theme }) => ({
  padding: theme.spaceScale(2),
  width: '100%',
  maxWidth: theme.spaceScale(16),
  margin: '0 auto',
}))

const PageButton = styled(Button)(({ isDisabled }) => ({
  border: isDisabled && '1px solid transparent',
}))

export const Pagination = ({ prev, next, page, totalPages, setPage }) => {
  const pageButtons = Array.from(Array(totalPages + 1).keys())
  const truncate = totalPages + 1 > 7
  // 1 2 3 ... 7
  // 1 ... 3 4 5 ... 7
  // 1 ... 5 6 7

  console.log(pageButtons)
  return (
    <PaginationContainer>
      <Flex alignItems="center" justifyContent="space-between">
        <PageButton
          type="button"
          color="blueGrey"
          shade={8}
          onClick={prev}
          variant="outline"
          isDisabled={!page}
        >
          Previous
        </PageButton>
        {pageButtons.map(pageNumber => (
          <PageButton
            type="button"
            color="blueGrey"
            shade={8}
            onClick={() => setPage(pageNumber)}
            variant="outline"
            isDisabled={page === pageNumber}
          >
            {pageNumber + 1}
          </PageButton>
        ))}
        <PageButton
          type="button"
          color="blueGrey"
          shade={8}
          onClick={next}
          variant="outline"
          isDisabled={page === totalPages}
        >
          Next
        </PageButton>
      </Flex>
    </PaginationContainer>
  )
}
