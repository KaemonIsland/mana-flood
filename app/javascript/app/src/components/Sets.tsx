import React from 'react'
import Turbolinks from 'turbolinks'

export const Sets = ({ sets }) => {
  const filteredSets = sets.filter(({ set_type }) => set_type === 'expansion')
  console.log('Sets: ', filteredSets)

  const viewSetCards = id => {
    Turbolinks.visit(`/sets/${id}`)
  }
  return (
    <>
      <h1>All Sets!</h1>
      <hr />
      {filteredSets.map(set => (
        <div key={set.id}>
          <h2>{set.name}</h2>
          <p>Code: {set.code}</p>
          <p>Base Set Size: {set.base_set_size}</p>
          <p>Release Date: {set.release_date}</p>
          <div onClick={() => viewSetCards(set.id)}>View all cards!</div>
        </div>
      ))}
    </>
  )
}
