// src/components/Farm/StakingInfo.js
import React from 'react';
import { VStack, Box, Text, Button, Divider } from '@chakra-ui/react';

function StakingInfo() {
    return (
        <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack spacing={4} align="stretch">
                <Text fontSize="xl" fontWeight="bold">Your Stakes</Text>

                <Box>
                    <Text>Total Staked: 1000 USDC</Text>
                    <Text>Total Rewards: 50 REWARD</Text>
                    <Text>Unlock Date: 2024-03-01</Text>
                </Box>

                <Divider />

                <Box>
                    <Text fontWeight="bold">Active Stakes</Text>
                    {/* 列出用户的质押记录 */}
                    <VStack spacing={2} mt={2}>
                        <Box p={3} borderWidth="1px" borderRadius="md">
                            <Text>500 USDC - 30 days</Text>
                            <Text fontSize="sm">Rewards: 25 REWARD</Text>
                        </Box>
                    </VStack>
                </Box>

                <Button colorScheme="red">Unstake All</Button>
            </VStack>
        </Box>
    );
}

export default StakingInfo;