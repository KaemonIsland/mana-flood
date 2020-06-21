import React, { ReactElement, useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Button } from 'warlock-ui'

const toastInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

const NotificationContainer = styled.div`
  font-size: ${({ theme }): void => theme.spaceScale(5)};
  position: fixed;
  z-index: 999999999;
  top: 12px;
  right: 12px;
  transition: transform 600ms ease-in-out;
  animation: ${toastInRight} 700ms;
  background: transparent

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
  & button {
    position: relative;
    right: -0.3em;
    top: -0.3em;
    float: right;
    font-weight: 700;
    outline: none;
    border: none;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.8;
    line-height: 1;
    font-size: 16px;
    padding: 0;
    cursor: pointer;
    background: 0 0;
  }
`

const NotificationTitle = styled.p(({ theme }) => ({
  fontWeight: 700,
  fontSize: theme.fontScale(3),
  textAlign: 'left',
  marginTop: 0,
  marginBottom: theme.spaceScale(1),
  width: '300px',
  height: theme.spaceScale(5),
}))

const NotificationMessage = styled.p(({ theme }) => ({
  margin: 0,
  textAlign: 'left',
  height: theme.spaceScale(5),
  marginLeft: '-1px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

const StyledToast = styled.div(({ theme }) => ({
  width: theme.spaceScale(13),
  padding: `${theme.spaceScale(1)} ${theme.spaceScale(3)}`,
  marginBottom: theme.spaceScale(2),
  backgroundColor: theme.color.blueVivid[3],
  boxShadow: theme.boxShadow.single[2],
}))

interface Toasts {
  title: string
  message: string
  id: number
}

interface ToastProps {
  toastList: Array<Toasts>
}

export const Toast = ({ toastList }: ToastProps): ReactElement => {
  const [list, setList] = useState(toastList)

  const removeToast = (id): void => {
    setList(list.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    setList(toastList)
  }, [toastList, list])

  return (
    <>
      <NotificationContainer>
        {list.map(({ title, message, id }, i) => (
          <StyledToast key={i}>
            <Button
              variant="outline"
              color="blue"
              shade={10}
              onClick={(): void => removeToast(id)}
            >
              X
            </Button>
            <div>
              <NotificationTitle>{title}</NotificationTitle>
              <NotificationMessage>{message}</NotificationMessage>
            </div>
          </StyledToast>
        ))}
      </NotificationContainer>
    </>
  )
}
