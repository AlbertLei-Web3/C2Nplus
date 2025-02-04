// src/components/Farm/ProjectCard.js
import React from 'react';
import { Box, VStack, Text, Button, HStack, Badge } from '@chakra-ui/react';

function ProjectCard() {
    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack align="stretch" spacing={4}>
                {/* 项目标题和状态 */}
                <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">Stable Yield Farm</Text>
                    <Badge colorScheme="green">Active</Badge>
                </HStack>

                {/* 项目描述 */}
                <Text color="gray.600">
                    Low-risk, stable returns through diversified yield farming strategies
                </Text>

                {/* 项目指标 */}
                <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                        <Text>Expected APY:</Text>
                        <Text fontWeight="bold" color="green.500">12.5%</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text>Total Value Locked:</Text>
                        <Text fontWeight="bold">$1.2M</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text>Risk Level:</Text>
                        <Badge colorScheme="blue">Low</Badge>
                    </HStack>
                </VStack>

                {/* 图表占位符 */}
                <Box h="100px" bg="gray.100" borderRadius="md">
                    {/* 这里可以添加实际的图表组件 */}
                    <Text textAlign="center" py={8}>APY Chart</Text>
                </Box>

                {/* 操作按钮 */}
                <HStack spacing={4}>
                    <Button colorScheme="blue" flex={1}>View Details</Button>
                    <Button colorScheme="green" flex={1}>Invest Now</Button>
                </HStack>
            </VStack>
        </Box>
    );
}

export default ProjectCard;