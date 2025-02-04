// src/pages/Farm.js
import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    VStack, 
    Heading, 
    Text, 
    Button, 
    useDisclosure,
    HStack
} from '@chakra-ui/react';
import { useWeb3 } from '../contexts/Web3Context';
import FarmCard from '../components/Farm/FarmCard';
import CreateFarmModal from '../components/Farm/CreateFarmModal';

function Farm() {
    const { factoryContract, account } = useWeb3();
    const [farms, setFarms] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (factoryContract) {
            loadFarms();
        }
    }, [factoryContract]);

    const loadFarms = async () => {
        if (!factoryContract) return;

        try {
            const farmAddresses = await factoryContract.getAllFarms();
            const farmsData = await Promise.all(
                farmAddresses.map(async (address) => {
                    // 这里可以添加获取每个农场详细信息的逻辑
                    return {
                        id: address,
                        address: address,
                        name: 'ETH-USDC',
                        apy: '12.5%',
                        tvl: '$1.2M',
                        lpTokenAddress: '0x...' // 需要从合约获取
                    };
                })
            );
            setFarms(farmsData);
        } catch (error) {
            console.error("Error loading farms:", error);
        }
    };

    return (
        <VStack spacing={8} align="stretch">
            <HStack justify="space-between">
                <Heading>Active Farms</Heading>
                <Button 
                    colorScheme="green" 
                    onClick={onOpen}
                    isDisabled={!account}
                >
                    Create New Farm
                </Button>
            </HStack>
            
            <Text>Stake your LP tokens to earn rewards</Text>
            
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {farms.map(farm => (
                    <FarmCard key={farm.id} farmData={farm} />
                ))}
            </Grid>

            <CreateFarmModal 
                isOpen={isOpen} 
                onClose={onClose} 
                onSuccess={loadFarms}
            />
        </VStack>
    );
}

export default Farm;