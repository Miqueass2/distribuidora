// pages/_app.js
import React from 'react';
import logo from '../public/logo.png';
import Image from 'next/image';
import { ChakraProvider, Container, VStack, Heading, Text, Box, Divider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
/* import logo from '../assets/logo.png'; */
import theme from '../../theme'
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        <Container
          borderRadius={'md'}
          background={'white'}
          marginY={4}
          boxShadow={4}
          maxWidth={'container.xl'}
          padding={4}>
          <VStack mb={6}>
            <Image width={200}
              height={200}
              src={logo}
              alt="logo"
              style={{borderRadius: '50%'}}  />
          <Heading textAlign={'center'} width={'248px'} fontWeight={'extrabold'}>Distribuidora Los Pibes</Heading>
          <Text>Hacé tu pedido acá y mandanos por wsp</Text>
        </VStack>
          <Divider  marginY={6}/>
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App;