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

interface PaginationProps {
  changePage: any
  page: number
  totalPages: number
}

export const Pagination = ({
  page,
  totalPages,
  changePage,
}: PaginationProps): ReactElement => {
  const [pageRange, setPageRange] = useState([])

  useEffect(() => {
    const buildPageRange = (): Array<number> => {
      let newPageRange = [page - 1, page, page + 1]

      if (page === 1) {
        newPageRange = [page + 1, page + 2]
      }

      if (page === totalPages) {
        newPageRange = [page - 2, page - 1]
      }

      return newPageRange.filter(page => page > 1 && page < totalPages)
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
          onClick={() => changePage(page - 1)}
          variant="outline"
          isDisabled={page === 1}
        >
          Previous
        </PageButton.Left>
        <PageButton
          type="button"
          color="grey"
          shade={8}
          onClick={() => changePage(1)}
          variant="outline"
          isDisabled={page === 1}
        >
          1
        </PageButton>
        {pageRange[0] > 2 && (
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
            onClick={() => changePage(pageNumber)}
            variant="outline"
            isDisabled={page === pageNumber}
          >
            {pageNumber}
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
            onClick={(): void => changePage(totalPages)}
            variant="outline"
            isDisabled={page === totalPages}
          >
            {totalPages}
          </PageButton>
        )}
        <PageButton.Right
          type="button"
          color="grey"
          shade={8}
          onClick={() => changePage(page + 1)}
          variant="outline"
          isDisabled={page === totalPages}
        >
          Next
        </PageButton.Right>
      </Flex>
    </PaginationContainer>
  )
}
