import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  height: 50px;
  display: flex;
  background-color: #fdfdfd;
  color: black;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`
const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Text = styled.p`
  margin: 0;
`

export const Footer = () => (
  <FooterContainer>
    <FooterContent>
      <Text>made with ❤ by Matlu ry</Text>
      <a href="https://github.com/MergHQ/klusterivilkku">source code</a>
    </FooterContent>
  </FooterContainer>
)
