// src/pages/AIAssistant.js
import React from 'react';
import { Grid, Box, VStack, Text, Progress } from '@chakra-ui/react';

function AIAssistant() {
    return (
        <Grid templateColumns="2fr 1fr" gap={8}>
            {/* 分析面板 */}
            <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg">
                <VStack align="stretch" spacing={6}>
                    <Text fontSize="xl" fontWeight="bold">Investment Analysis</Text>
                    
                    <Box>
                        <Text>Risk Score</Text>
                        <Progress value={80} colorScheme="green" />
                    </Box>

                    <Box>
                        <Text fontWeight="bold">Recommendations</Text>
                        <Text mt={2}>Based on your profile, we recommend:</Text>
                        <VStack align="stretch" mt={2}>
                            <Box p={3} borderWidth="1px" borderRadius="md">
                                <Text>ETH-USDC Farm</Text>
                                <Text fontSize="sm">Stable returns with moderate risk</Text>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>
            </Box>

            {/* 监控面板 */}
            <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg">
                <VStack align="stretch" spacing={6}>
                    <Text fontSize="xl" fontWeight="bold">Market Monitor</Text>
                    
                    <Box>
                        <Text>Market Sentiment</Text>
                        <Text color="green.500">Bullish</Text>
                    </Box>

                    <Box>
                        <Text>Risk Alerts</Text>
                        <Text fontSize="sm" color="red.500">
                            High volatility detected in ETH market
                        </Text>
                    </Box>
                </VStack>
            </Box>
        </Grid>
    );
}

export default AIAssistant;