import React, { ReactElement, FormEvent } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { capitalize } from '../../utils'

const InputContainer = styled.div(({ disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

const StyledInput = styled.input(({ theme }) => ({
  position: 'absolute',
  opacity: 0,
  cursor: 'pointer',
  height: 0,
  width: 0,
}))

const StyledLabel = styled.label(({ theme }) => ({
  display: 'block',
  position: 'relative',
  paddingLeft: '35px',
  marginBottom: '12px',
  cursor: 'pointer',
  fontSize: '22px',
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  userSelect: 'none',
  '&:hover span': {
    backgroundColor: '#ccc',
  },
  '& input:checked ~ span': {
    backgroundColor: '#2196F3',
  },
  '& input:checked ~ span:after': {
    display: 'block',
  },

  '& span:after': {
    left: '9px',
    top: '5px',
    width: '5px',
    height: '10px',
    border: 'solid white',
    borderWidth: ' 0 3px 3px 0',
    '-webkit-transform': 'rotate(45deg)',
    '-ms-transform': 'rotate(45deg)',
    transform: 'rotate(45deg)',
  },
}))

const StyledSpan = styled.span(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '25px',
  width: '25px',
  backgroundColor: '#eee',
  '&:after': {
    content: '',
    position: 'absolute',
    display: 'none',
  },
}))

interface OnChange {
  (event: FormEvent): void
}

interface InputProps {
  onChange: OnChange
  name: string
  label: string
  hint?: string
  removeHint?: boolean
  disabled?: boolean
  options: Array<string>
  checked?: boolean
}

export const Checkbox = ({
  onChange,
  label,
  name,
  hint,
  removeHint = false,
  disabled = false,
  options,
  checked,
  ...rest
}: InputProps): ReactElement => {
  return (
    <div>
      <Text>{label}</Text>
      <InputContainer disabled={disabled}>
        {options.map(option => (
          <>
            <StyledLabel htmlFor={option}>
              {capitalize(option)}
              <StyledSpan />
              <StyledInput
                {...rest}
                type="checkbox"
                onChange={onChange}
                id={option}
                name={name}
                value={option}
                disabled={disabled}
                checked={checked}
              />
            </StyledLabel>
          </>
        ))}
      </InputContainer>
      {!removeHint && (
        <Text size={2} display="inline" color="grey" shade={6}>
          {hint}
        </Text>
      )}
    </div>
  )
}
