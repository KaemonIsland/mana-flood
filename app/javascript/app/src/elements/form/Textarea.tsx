import React, { ReactElement, FormEvent } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { capitalize } from '../../utils'

const InputContainer = styled.div(({ disabled }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'end',
  opacity: disabled ? 0.5 : 1,
}))

const StyledTextarea = styled.textarea(({ theme }) => ({
  width: '100%',
  border: '1px solid transparent',
  borderBottom: '3px solid transparent',
  boxShadow: theme.boxShadow.single[1],
  borderRadius: theme.spaceScale(2),
  marginTop: theme.spaceScale(4),
  padding: theme.spaceScale(3),
  transition: 'all 250ms ease-in-out',
  '&:focus': {
    border: `1px solid black`,
    '&:valid': {
      borderBottom: `3px solid ${theme.color.greenVivid[3]}`,
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
  cursor: 'text',
  top: 25,
  left: 10,
  userSelect: 'none',
  transition: 'all 250ms ease-in-out',
  transformOrigin: '0 0',
  opacity: 0.5,
}))

interface OnChange {
  (event: FormEvent): void
}

interface TextareaProps {
  onChange: OnChange
  name: string
  placeholder: string
  label: string
  value: string | number
  type?: string
  autoComplete?: boolean
  hint?: string
  removeHint?: boolean
  disabled?: boolean
  cols?: number
}

export const Textarea = ({
  onChange,
  name,
  placeholder,
  label,
  value,
  autoComplete = false,
  hint,
  removeHint = false,
  disabled = false,
  ...rest
}: TextareaProps): ReactElement => {
  return (
    <InputContainer disabled={disabled}>
      <StyledTextarea
        placeholder={placeholder}
        onChange={onChange}
        id={name}
        name={name}
        value={value}
        autoComplete={autoComplete ? 'on' : 'off'}
        disabled={disabled}
        {...rest}
      />
      <StyledLabel htmlFor={name}>{capitalize(label)}</StyledLabel>
      {!removeHint && (
        <Text size={2} display="inline" color="grey" shade={6}>
          {hint}
        </Text>
      )}
    </InputContainer>
  )
}
