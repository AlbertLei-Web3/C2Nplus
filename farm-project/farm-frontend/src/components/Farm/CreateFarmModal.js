// src/components/Farm/CreateFarmModal.js
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useWeb3 } from '../../contexts/Web3Context';
import { ethers } from 'ethers';

function CreateFarmModal({ isOpen, onClose, onSuccess }) {
    const { factoryContract, account } = useWeb3();
    const [rewardToken, setRewardToken] = useState('');
    const [rewardPerSecond, setRewardPerSecond] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const toast = useToast();

    const handleCreate = async () => {
        if (!account) {
            toast({
                title: "Error",
                description: "Please connect your wallet first",
                status: "error",
                duration: 5000,
            });
            return;
        }

        if (!rewardToken || !rewardPerSecond) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                status: "error",
                duration: 5000,
            });
            return;
        }

        setIsCreating(true);
        try {
            // 调用 Factory 合约的 createFarm 函数
            const tx = await factoryContract.createFarm(
                rewardToken,
                ethers.parseEther(rewardPerSecond),
                Math.floor(Date.now() / 1000) // 当前时间作为开始时间
            );
            await tx.wait();
            
            toast({
                title: "Success",
                description: "Farm created successfully",
                status: "success",
                duration: 5000,
            });
            
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Farm</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Reward Token Address</FormLabel>
                            <Input
                                placeholder="Enter reward token address"
                                value={rewardToken}
                                onChange={(e) => setRewardToken(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Reward Per Second</FormLabel>
                            <Input
                                placeholder="Enter reward per second"
                                value={rewardPerSecond}
                                onChange={(e) => setRewardPerSecond(e.target.value)}
                                type="number"
                            />
                        </FormControl>

                        <Button
                            colorScheme="blue"
                            width="100%"
                            onClick={handleCreate}
                            isLoading={isCreating}
                        >
                            Create Farm
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default CreateFarmModal;