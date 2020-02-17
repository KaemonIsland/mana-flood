import React from 'react'
import { getAllCards } from '../mtgJsonApi/mtgJson'

export const Admin = () => {
  return (
    <>
      <button onClick={getAllCards}>Update card collection</button>
    </>
  )
}
