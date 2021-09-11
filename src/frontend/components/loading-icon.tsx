import styled, { keyframes } from 'styled-components'

const rotate360 = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  background: black;
  width: 56px;
  height: 56px;
  border-radius: 50%;
`

export default Spinner
