import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 5px;
  display: flex;
  flex-direction: column;
  margin: 15px 0px;
`

const Input = styled.input`
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid black;
  height: 3em;
  font-size: 24px;
`

const Error = styled.p`
  color: red;
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SubmitButton = styled.button`
  width: 6em;
  height: 2.5em;
  font-size: 24px;
  color: #ffffff;
  background-color: #353535;
  border: none;
`

type ControlledInputProps = {
  type: React.HTMLInputTypeAttribute
  label: string
  name: string
  required?: boolean
  validate?: (value: string) => string | null
  onChange?: (field: string, value: string) => void
  className?: string
}

export const ControlledInput = ({
  label,
  name,
  type,
  required,
  validate,
  onChange,
  className,
}: ControlledInputProps) => {
  const [error, setError] = React.useState<string | null>(null)

  return (
    <Wrapper>
      <Input
        placeholder={label}
        className={className}
        type={type}
        name={name}
        required={required}
        onChange={e => {
          onChange && onChange(name, e.target.value)
          setError(validate ? validate(e.target.value) : null)
        }}
      />
      {error && <Error>{error}</Error>}
    </Wrapper>
  )
}

export const Submit = ({ label }: { label: string }) => (
  <ButtonWrapper>
    <SubmitButton type="submit">{label}</SubmitButton>
  </ButtonWrapper>
)
