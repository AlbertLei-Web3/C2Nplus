import React from 'react';
import {
  ChakraProvider,
  Box,
  Button,
  Container,
  Heading
} from '@chakra-ui/react';
import { Web3Provider } from './contexts/Web3Context';
import FarmList from './components/FarmList';
import { useWeb3 } from './contexts/Web3Context';

function ConnectButton() {
  const { account, connectWallet } = useWeb3();
  
  return (
    <Button 
      onClick={connectWallet} 
      colorScheme="blue"
      size="md"
    >
      {account 
        ? `Connected: ${account.substring(0,6)}...${account.substring(-4)}` 
        : 'Connect Wallet'
      }
    </Button>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Container maxW="container.lg" py={8}>
          <Heading mb={6}>Farm DApp</Heading>
          <Box mb={8}>
            <ConnectButton />
          </Box>
          <FarmList />
        </Container>
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App;