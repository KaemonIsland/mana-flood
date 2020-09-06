import React, { ReactElement, FormEvent } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { capitalize } from '../../utils'

const InputContainer = styled.div(({ disabled }) => ({
  position: 'relative',
  width: '100%',
  opacity: disabled ? 0.5 : 1,
}))

const StyledSelect = styled.select(({ theme, isEmpty }) => ({
  width: '100%',
  border: '1px solid transparent',
  boxShadow: theme.boxShadow.single[1],
  borderRadius: theme.spaceScale(2),
  marginTop: theme.spaceScale(4),
  padding: theme.spaceScale(2),
  cursor: 'pointer',
  transition: 'all 250ms ease-in-out',
  '&:focus': {
    border: `1px solid black`,
    '& + label': {
      transform: 'translate(-2%, -120%) scale(0.85)',
      opacity: 0.75,
    },
  },
  '& + label': {
    ...(isEmpty
      ? {
          transform: 'translate(-2%, -120%) scale(0.85)',
          opacity: 0.75,
        }
      : {}),
  },
}))

const StyledLabel = styled.label(() => ({
  position: 'absolute',
  top: 22,
  left: 10,
  userSelect: 'none',
  transition: 'all 250ms ease-in-out',
  cursor: 'pointer',
  transformOrigin: '0 0',
  opacity: 0.5,
}))

interface OnChange {
  (event: FormEvent): void
}

interface Options {
  value: string
  props?: any
  label?: string
}

interface InputProps {
  onChange: OnChange
  name: string
  label: string
  hint?: string
  removeHint?: boolean
  disabled?: boolean
  options: Array<Options>
  value: any
}

export const Select = ({
  onChange,
  label,
  name,
  hint,
  removeHint = false,
  options,
  value,
  disabled = false,
  ...rest
}: InputProps): ReactElement => {
  return (
    <InputContainer disabled={disabled}>
      <StyledSelect
        isEmpty={value}
        disabled={disabled}
        name={name}
        id={name}
        onChange={onChange}
        value={value}
        {...rest}
      >
        {options.map(({ value, label, ...props }, index) => (
          <option value={value} key={index} {...props}>
            {capitalize(label || value)}
          </option>
        ))}
      </StyledSelect>
      <StyledLabel htmlFor={name}>{capitalize(label)}</StyledLabel>
      {!removeHint && (
        <Text
          size={2}
          display="block"
          color="grey"
          shade={6}
          style={{ textAlign: 'right' }}
        >
          {hint}
        </Text>
      )}
    </InputContainer>
  )
}
