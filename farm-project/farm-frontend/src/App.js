import React from 'react';
import { ChakraProvider, Heading, Box, Button, Container } from '@chakra-ui/react';
import { Web3Provider } from './contexts/Web3Context';
import FarmList from './components/FarmList';
import { useWeb3 } from './contexts/Web3Context';
import { defineConfig } from '@chakra-ui/react';

// 定义主题配置
export const theme = defineConfig({
  colors: {
    brand: {
      500: '#FF5733', // 自定义颜色
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold', // 设置按钮的基础样式
      },
    },
  },
});

function ConnectButton() {
  const { account, connectWallet } = useWeb3();
    
  return (
    <Button onClick={connectWallet} colorScheme="blue">
      {account ? `Connected: ${account.substring(0,6)}...${account.substring(-4)}` : 'Connect Wallet'}
    </Button>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>  {/* 传递 theme 属性 */}
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
