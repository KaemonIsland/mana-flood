import React, { ReactChild, ReactElement, FormEvent } from 'react'

interface OnSubmit {
  (event: FormEvent): void
}

interface FormProps {
  children: Array<ReactChild> | ReactChild
  onSubmit: OnSubmit
}

export const Form = ({
  onSubmit,
  children,
  ...rest
}: FormProps): ReactElement => {
  return (
    <form onSubmit={onSubmit} {...rest}>
      {children}
    </form>
  )
}
