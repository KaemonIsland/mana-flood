import React, { ReactElement, FormEvent, useState, useEffect } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { Feather } from '../../components'
import { capitalize } from '../../utils'

const InputContainer = styled.div(() => ({}))

const OptionContainer = styled.div(({ disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

const StyledInput = styled.input(({ theme, disabled }) => ({
  position: 'absolute',
  opacity: 0,
  top: '-9999px',
  left: '-9999px',
  '&:hover + span, &:focus + span': {
    borderRadius: theme.spaceScale(2),
    backgroundColor: !disabled && theme.color.purple[2],
  },
}))

const StyledLabel = styled.label(({ theme, disabled }) => ({
  position: 'relative',
  opacity: disabled ? 0.5 : 1,
  paddingLeft: theme.spaceScale(6),
  cursor: disabled ? '' : 'pointer',
  fontSize: theme.fontScale(5),
  borderRadius: theme.spaceScale(2),
}))

const StyledSpan = styled.span(({ theme }) => ({
  position: 'absolute',
  top: 4,
  left: 0,
  backgroundColor: 'transparent',
}))

interface OnChange {
  (event: FormEvent): void
}

interface InputItemProps {
  onChange: OnChange
  name: string
  options: Array<Options>
  props?: any
  value: string
  label: string
  groupValue: Array<any>
}

const CheckboxItem = ({
  value,
  label,
  props = {},
  name,
  onChange,
  groupValue,
}: InputItemProps): ReactElement => {
  const checked = groupValue.includes(value)

  return (
    <StyledLabel htmlFor={value} disabled={props.disabled}>
      {capitalize(label || value)}
      <StyledInput
        type="checkbox"
        onChange={onChange}
        id={value}
        name={name}
        value={value}
        {...props}
        checked={checked}
      />
      <StyledSpan>
        <Feather size="small" icon={`${checked ? 'check-' : ''}square`} />
      </StyledSpan>
    </StyledLabel>
  )
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
  value: Array<any>
}

export const Checkbox = ({
  onChange,
  label,
  name,
  hint,
  removeHint = false,
  options,
  value,
}: InputProps): ReactElement => {
  return (
    <InputContainer>
      <Text>{label}</Text>
      <OptionContainer>
        {options.map((option, index) => (
          <CheckboxItem
            {...option}
            groupValue={value}
            name={name}
            onChange={onChange}
            key={index}
          />
        ))}
      </OptionContainer>
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
