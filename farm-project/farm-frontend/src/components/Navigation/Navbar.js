// src/components/Navigation/Navbar.js
import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Button,
    useColorModeValue,
    Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';

function Navbar() {
    const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();

    // 格式化地址显示
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <Box bg={useColorModeValue('white', 'gray.800')} px={4} shadow="sm">
            <Flex h={16} alignItems="center" justifyContent="space-between">
                <HStack spacing={8}>
                    <HStack spacing={4}>
                        <Link to="/"><Button variant="ghost">Home</Button></Link>
                        <Link to="/farm"><Button variant="ghost">Farm</Button></Link>
                        <Link to="/projects"><Button variant="ghost">Projects</Button></Link>
                        <Link to="/staking"><Button variant="ghost">Staking</Button></Link>
                        <Link to="/ai-assistant"><Button variant="ghost">AI Assistant</Button></Link>
                    </HStack>
                </HStack>

                {account ? (
                    <HStack>
                        <Text>{formatAddress(account)}</Text>
                        <Button colorScheme="red" onClick={disconnectWallet}>
                            Disconnect
                        </Button>
                    </HStack>
                ) : (
                    <Button 
                        colorScheme="blue" 
                        onClick={connectWallet}
                        isLoading={isConnecting}
                        loadingText="Connecting..."
                    >
                        Connect Wallet
                    </Button>
                )}
            </Flex>
        </Box>
    );
}

export default Navbar;