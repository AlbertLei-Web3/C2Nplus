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
    Input,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react';

export default function FarmList() {
    const { account, signer, farms } = useWeb3();
    const [farmContracts, setFarmContracts] = useState([]);
    const [amounts, setAmounts] = useState({});
    const [alert, setAlert] = useState(null);  // State for managing alerts

    useEffect(() => {
        if (signer && farms.length > 0) {
            const contracts = farms.map(address => 
                new ethers.Contract(address, FARM_ABI, signer)
            );
            setFarmContracts(contracts);
        }

        console.log("Current account:", account);
        console.log("Current farms:", farms);

    }, [signer, farms, account]);

    if (!account) {
        return (
            <Alert status="warning">
                <AlertIcon />
                <AlertDescription>
                    Please connect your wallet first
                </AlertDescription>
            </Alert>
        );
    }

    const handleDeposit = async (farmContract, amount, index) => {
        try {
            const tx = await farmContract.deposit(0, ethers.parseEther(amount));
            await tx.wait();
            setAlert({
                status: "success",
                message: "Successfully deposited tokens"
            });
        } catch (error) {
            setAlert({
                status: "error",
                message: error.message
            });
        }
    };

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="xl">Available Farms: {farms?.length || 0}</Text>
            {alert && (
                <Alert status={alert.status}>
                    <AlertIcon />
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}
            {farms && farms.length > 0 ? (
                farms.map((farmAddress, index) => {
                    const farm = farmContracts[index]; // 获取对应的 farm 合约
                    return (
                        <Box key={index} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                            <Text>Farm Address: {farmAddress}</Text>
                            <HStack mt={2}>
                                <Input
                                    placeholder="Amount to deposit"
                                    value={amounts[index] || ''}
                                    onChange={(e) => setAmounts({
                                        ...amounts,
                                        [index]: e.target.value
                                    })}
                                />
                                <Button
                                    colorScheme="blue"
                                    onClick={() => handleDeposit(farm, amounts[index], index)}
                                    isDisabled={!account}
                                >
                                    Deposit
                                </Button>
                            </HStack>
                        </Box>
                    );
                })
            ) : (
                <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>No farms available yet</AlertDescription>
                </Alert>
            )}
        </VStack>
    );
}
