import React from 'react'
import { getAllCards, getAllSets } from '../mtgJsonApi/mtgJson'

export const Admin = () => {
  return (
    <>
      <button onClick={getAllCards}>Update card collection</button>
      <button onClick={getAllSets}>Update card sets</button>
    </>
  )
}
