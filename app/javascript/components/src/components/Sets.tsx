import React from 'react'

export const Sets = ({ sets }) => {
  const filteredSets = sets.filter(({ set_type }) => set_type !== 'promo')
  console.log('Sets: ', filteredSets)
  return (
    <>
      <h1>All Sets!</h1>
    </>
  )
}
