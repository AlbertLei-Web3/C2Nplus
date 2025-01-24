import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { FARM_ABI } from '../contracts/abis';
import {
    Box,
    Button,
    Text,
    VStack,
    HStack,
    Input
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';


export default function FarmList() {
    const { account, signer, farms } = useWeb3();
    const [farmContracts, setFarmContracts] = useState([]);
    const [amounts, setAmounts] = useState({});
    const toast = useToast();

    useEffect(() => {
        if (signer && farms.length > 0) {
            const contracts = farms.map(address => 
                new ethers.Contract(address, FARM_ABI, signer)
            );
            setFarmContracts(contracts);
        }
    }, [signer, farms]);

    const handleDeposit = async (farmContract, amount, index) => {
        try {
            const tx = await farmContract.deposit(0, ethers.parseEther(amount));
            await tx.wait();
            toast({
                title: "Success",
                description: "Successfully deposited tokens",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack spacing={4}>
            <Text fontSize="2xl">Farm List</Text>
            {farmContracts.map((farm, index) => (
                <Box key={index} p={4} border="1px" borderRadius="md">
                    <Text>Farm Address: {farm.address}</Text>
                    <HStack mt={2}>
                        <Input
                            placeholder="Amount"
                            value={amounts[index] || ''}
                            onChange={(e) => setAmounts({
                                ...amounts,
                                [index]: e.target.value
                            })}
                        />
                        <Button
                            onClick={() => handleDeposit(farm, amounts[index], index)}
                            isDisabled={!account}
                        >
                            Deposit
                        </Button>
                    </HStack>
                </Box>
            ))}
        </VStack>
    );
}