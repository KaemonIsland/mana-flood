import React, { ReactElement, FormEvent } from 'react'
import { Text } from 'warlock-ui'
import styled from 'styled-components'
import { Feather } from '../../components'
import { capitalize } from '../../utils'

const InputContainer = styled.div(() => ({}))

const OptionContainer = styled.div(() => ({
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

const StyledSpan = styled.span(() => ({
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
  props?: any
  value: boolean
  label?: string
}

const CheckboxItem = ({
  value,
  props = {},
  onChange,
  label,
}: InputItemProps): ReactElement => {
  return (
    <StyledLabel htmlFor={value} disabled={props.disabled}>
      {capitalize(label || '')}
      <StyledInput
        type="checkbox"
        onChange={onChange}
        value={value}
        checked={value}
        {...props}
      />
      <StyledSpan>
        <Feather size="small" icon={`${value ? 'check-' : ''}square`} />
      </StyledSpan>
    </StyledLabel>
  )
}

interface InputProps {
  onChange: OnChange
  label: string
  hint?: string
  removeHint?: boolean
  disabled?: boolean
  value: boolean
}

/**
 * A confirm checkbox that only has one option that can be true or false.
 *
 * This is a simplified version of the checkbox component
 *
 * @param {func} onChange - Called when the box/label is clicked
 * @param {string} label - Clickable text next to the checkbox
 * @param {string} hint - Supportive text further explaining the checkbox usage.
 * @param {boolean} removeHint - Whether room for the hint should be removed or not
 * @param {boolean} value - the current value of the checkbox
 */
export const CheckboxConfirm = ({
  onChange,
  label,
  hint,
  removeHint = false,
  value,
}: InputProps): ReactElement => {
  return (
    <InputContainer>
      <OptionContainer>
        <CheckboxItem value={value} onChange={onChange} label={label} />
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
