import React, { useState, useEffect } from 'react'

export const usePagination = cards => {
  const [paginatedCards, setPaginatedCards] = useState([])
  const [page, setPage] = useState(0)

  const cardsPerPage = 30

  const totalPages =
    cards.length === cardsPerPage * page
      ? 0
      : Math.floor(cards.length / cardsPerPage)

  const min = cardsPerPage * page
  const max = Math.min(min + cardsPerPage, cards.length)

  const next = () => {
    const nextPage = page + 1
    if (nextPage * cardsPerPage <= cards.length) {
      setPage(page + 1)
    }
  }
  const prev = () => {
    const prevPage = page - 1

    if (prevPage >= 0) {
      setPage(prevPage)
    }
  }

  useEffect(() => {
    if (cards.length !== 0) {
      setPaginatedCards(cards.slice(min, max))
    }
  }, [page, cards])

  useEffect(() => {
    setPage(0)
  }, [cards])

  return {
    paginatedCards,
    next,
    prev,
    totalPages,
    page,
    setPage,
  }
}
