// src/components/Farm/StakingPanel.js
import React from 'react';
import { VStack, Box, Select, Input, Button, Text } from '@chakra-ui/react';

function StakingPanel() {
    return (
        <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack spacing={4} align="stretch">
                <Text fontSize="xl" fontWeight="bold">Stake Tokens</Text>
                
                <Select placeholder="Select token">
                    <option value="eth">ETH</option>
                    <option value="usdc">USDC</option>
                    <option value="dai">DAI</option>
                </Select>

                <Input placeholder="Enter amount" />
                
                <Select placeholder="Select duration">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                </Select>

                <Text>Estimated APY: 12.5%</Text>
                <Text>Estimated Rewards: 100 REWARD</Text>

                <Button colorScheme="blue">Stake</Button>
            </VStack>
        </Box>
    );
}

export default StakingPanel;