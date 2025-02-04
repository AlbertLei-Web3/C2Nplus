import React from 'react';
import { VStack, Heading, Text, Button, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

function Home() {
    return (
      <VStack spacing={8}>
        <Heading>Welcome to DeFi Farm</Heading>
        <Text>Intelligent Farming with AI-Powered Insights</Text>

        <VStack spacing={4}>
          <Stat>
            <StatLabel>Total Value Locked</StatLabel>
            <StatNumber>$1.2M</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Active Farms</StatLabel>
            <StatNumber>5</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Users</StatLabel>
            <StatNumber>1.2k</StatNumber>
          </Stat>
        </VStack>

        <Button colorScheme="blue">Start Farming</Button>
        <Button colorScheme="blue">View Analytics</Button>
        <Button colorScheme="blue">Get AI Advice</Button>
      </VStack>
    );
}

export default Home;