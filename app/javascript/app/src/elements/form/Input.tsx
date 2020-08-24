import React, { ReactElement, FormEvent } from 'react'
import styled from 'styled-components'
import { capitalize } from '../../utils'

const InputContainer = styled.div(({ theme }) => ({
  position: 'relative',
  height: '5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
}))

const StyledInput = styled.input(({ theme }) => ({
  width: '100%',
  border: `2px solid ${theme.color.grey[4]}`,
  borderBottom: `3px solid ${theme.color.grey[4]}`,
  boxShadow: theme.boxShadow.single[2],
  borderRadius: theme.spaceScale(2),
  padding: theme.spaceScale(2),
  transition: 'all 250ms ease-in-out',
  '&:focus': {
    border: `2px solid ${theme.color.grey[6]}`,
    '&:valid': {
      borderBottom: `3px solid ${theme.color.greenVivid[4]}`,
    },
  },
  '&:invalid': {
    borderBottom: `3px solid ${theme.color.redVivid[4]}`,
  },
  '&::placeholder': {
    color: 'transparent',
  },
  '&:focus, &:not(:placeholder-shown)': {
    '& + label': {
      transform: 'translate(-2%, -120%) scale(0.85)',
      opacity: 0.75,
    },
  },
}))

const StyledLabel = styled.label(({ theme }) => ({
  position: 'absolute',
  top: 28,
  left: 10,
  userSelect: 'none',
  transition: 'all 250ms ease-in-out',
  transformOrigin: '0 0',
  opacity: 0.5,
}))

interface OnChange {
  (event: FormEvent): void
}

interface InputProps {
  onChange: OnChange
  name: string
  placeholder: string
  label: string
  value: string | number
  type: string
}

export const Input = ({
  onChange,
  name,
  placeholder,
  label,
  value,
  type = 'text',
  ...rest
}: InputProps): ReactElement => {
  return (
    <InputContainer>
      <StyledInput
        {...rest}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        id={name}
        value={value}
        autofill={false}
      />
      <StyledLabel htmlFor={name}>{capitalize(label)}</StyledLabel>
    </InputContainer>
  )
}
