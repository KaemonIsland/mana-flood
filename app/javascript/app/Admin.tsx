import React from 'react'
import { Button, ThemeProvider, Container } from 'warlock-ui'
import { getAllCards } from '../mtgJsonApi/mtgJson'

export const Admin = () => {
  return (
    <ThemeProvider>
      <Container margin={[4, 2]}>
        <Button color="red" shade={3} onClick={getAllCards}>
          Update card collection
        </Button>
      </Container>
    </ThemeProvider>
  )
}
