import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3Provider } from './contexts/Web3Context';
import { Box, Button, Container } from '@chakra-ui/react'; // 移除未使用的 Text
import FarmList from './components/FarmList';
import { useWeb3 } from './contexts/Web3Context';

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
        <ChakraProvider>
            <Web3Provider>
                <Container maxW="container.lg" py={8}>
                    <Box mb={8}>
                        <ConnectButton />
                    </Box>
                    <FarmList />  {/* 添加这个组件的使用 */}
                </Container>
            </Web3Provider>
        </ChakraProvider>
    );
}

export default App;