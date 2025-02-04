// src/components/Farm/FarmCard.js
import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, HStack, Image, useToast, Input } from '@chakra-ui/react';
import { useWeb3 } from '../../contexts/Web3Context';
import { ethers } from 'ethers';
import { FARM_ABI } from '../../contracts/abis';

function FarmCard({ farmData }) {
    const { account, signer } = useWeb3();
    const [farmContract, setFarmContract] = useState(null);
    const [userStake, setUserStake] = useState('0');
    const toast = useToast();
    const [stakeAmount, setStakeAmount] = useState('');
    const [pendingRewards, setPendingRewards] = useState('0');
    const [isApproving, setIsApproving] = useState(false);
    const [allowance, setAllowance] = useState('0');

    useEffect(() => {
        if (signer && farmData.address) {
            const contract = new ethers.Contract(farmData.address, FARM_ABI, signer);
            setFarmContract(contract);
            loadUserStake();
        }
    }, [signer, farmData.address]);



    // 添加加载奖励信息的函数
    const loadPendingRewards = async () => {
        if (farmContract && account) {
            try {
                const rewards = await farmContract.pendingReward(0, account);
                setPendingRewards(ethers.formatEther(rewards));
            } catch (error) {
                console.error("Error loading rewards:", error);
            }
        }
    };

    // 检查授权
    const checkAllowance = async () => {
        if (farmContract && account) {
            const lpToken = new ethers.Contract(
                farmData.lpTokenAddress,
                ['function allowance(address,address) view returns (uint256)'],
                signer
            );
            const amount = await lpToken.allowance(account, farmData.address);
            setAllowance(amount.toString());
        }
    };

    // 授权函数
    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const lpToken = new ethers.Contract(
                farmData.lpTokenAddress,
                ['function approve(address,uint256) returns (bool)'],
                signer
            );
            const tx = await lpToken.approve(
                farmData.address,
                ethers.MaxUint256
            );
            await tx.wait();
            await checkAllowance();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        } finally {
            setIsApproving(false);
        }
    };


    const loadUserStake = async () => {
        if (farmContract && account) {
            try {
                const userInfo = await farmContract.userInfo(0, account);
                setUserStake(ethers.formatEther(userInfo.amount));
            } catch (error) {
                console.error("Error loading user stake:", error);
            }
        }
    };

    const handleStake = async () => {
        if (!account || !stakeAmount) return;
        try {
            const tx = await farmContract.deposit(
                0,
                ethers.parseEther(stakeAmount)
            );
            await tx.wait();
            loadUserStake();
            setStakeAmount('');
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        }
    };

     // 添加提取函数
     const handleWithdraw = async () => {
        if (!account || !userStake) return;
        try {
            const tx = await farmContract.withdraw(0, ethers.parseEther(userStake));
            await tx.wait();
            loadUserStake();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        }
    };

    const handleHarvest = async () => {
        if (!account) return;

        try {
            const tx = await farmContract.harvest(0);
            await tx.wait();
            
            toast({
                title: "Success",
                description: "Rewards harvested successfully",
                status: "success",
                duration: 5000,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        }
    };

    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                    <HStack>
                        <Text fontWeight="bold">{farmData.name}</Text>
                    </HStack>
                    <Text color="green.500" fontWeight="bold">APY: {farmData.apy}</Text>
                </HStack>
                

                <VStack align="stretch" spacing={2}>
                    <Text>TVL: {farmData.tvl}</Text>
                    <Text>Your Stake: {userStake}</Text>
                </VStack>

                <HStack spacing={4}>
                    <Button 
                        colorScheme="blue" 
                        flex={1} 
                        onClick={handleStake}
                        isDisabled={!account}
                    >
                        Stake
                    </Button>
                    <Button 
                        colorScheme="green" 
                        flex={1} 
                        onClick={handleHarvest}
                        isDisabled={!account || userStake === '0'}
                    >
                        Harvest
                    </Button>
                </HStack>
                
                {/* 添加输入框 */}
                <Input
                    placeholder="Enter amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    type="number"
                />

                {/* 添加授权按钮 */}
                {Number(allowance) === 0 ? (
                    <Button
                        colorScheme="purple"
                        onClick={handleApprove}
                        isLoading={isApproving}
                    >
                        Approve LP Token
                    </Button>
                ) : (
                    <HStack spacing={4}>
                        <Button
                            colorScheme="blue"
                            onClick={handleStake}
                            isDisabled={!account || !stakeAmount}
                        >
                            Stake
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleWithdraw}
                            isDisabled={!account || userStake === '0'}
                        >
                            Withdraw
                        </Button>
                    </HStack>
                )}

                {/* 显示奖励 */}
                <Text>Pending Rewards: {pendingRewards}</Text>
            </VStack>
        </Box>
    );
}

export default FarmCard;