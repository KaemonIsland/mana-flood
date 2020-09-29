import React, { ReactElement, useRef, useState } from 'react'
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

const StyledInput = styled.input(() => ({
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
}))

const StyledLabel = styled.label(({ theme }) => ({
  cursor: 'pointer',
  width: '100%',
  border: '1px solid transparent',
  borderBottom: '3px solid transparent',
  boxShadow: theme.boxShadow.single[1],
  borderRadius: theme.spaceScale(2),
  marginTop: theme.spaceScale(4),
  padding: theme.spaceScale(2),
  backgroundColor: 'white',
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
}))

interface OnChange {
  (element: File): void
}

interface InputProps {
  onChange: OnChange
  accept: string
  name: string
  label: string
  hint?: string
  removeHint?: boolean
  disabled?: boolean
}

export const File = ({
  onChange,
  accept,
  name,
  label,
  hint,
  removeHint = false,
  disabled = false,
  ...rest
}: InputProps): ReactElement => {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)

  return (
    <InputContainer disabled={disabled}>
      <StyledInput
        onChange={() => {
          onChange(inputRef?.current)
          setFile(inputRef?.current?.files[0])
        }}
        type="file"
        ref={inputRef}
        accept={accept}
        id={name}
        name={name}
        disabled={disabled}
        {...rest}
      />
      <StyledLabel htmlFor={name}>{`${capitalize(
        file?.name || label
      )}`}</StyledLabel>
      {!removeHint && (
        <Text size={2} display="inline" color="grey" shade={6}>
          {hint}
        </Text>
      )}
    </InputContainer>
  )
}
