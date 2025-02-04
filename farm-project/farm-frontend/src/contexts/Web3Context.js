// src/contexts/Web3Context.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FACTORY_ABI } from '../contracts/abis';
import { FACTORY_ADDRESS } from '../contracts/address';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [factoryContract, setFactoryContract] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [chainId, setChainId] = useState(null);

    // 连接钱包
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        setIsConnecting(true);
        try {
            // 请求用户连接钱包
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // 创建 provider 和 signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();

            setProvider(provider);
            setSigner(signer);
            setAccount(account);
            setChainId(network.chainId);

            // 初始化 Factory 合约
            const factory = new ethers.Contract(
                FACTORY_ADDRESS,
                FACTORY_ABI,
                signer
            );
            setFactoryContract(factory);

        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet: " + error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    // 断开钱包连接
    const disconnectWallet = () => {
        setAccount(null);
        setSigner(null);
        setFactoryContract(null);
    };

    // 监听钱包事件
    useEffect(() => {
        if (window.ethereum) {
            // 账户变化监听
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    disconnectWallet();
                }
            });

            // 链变化监听
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });

            // 检查是否已经连接
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        connectWallet();
                    }
                });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', disconnectWallet);
                window.ethereum.removeListener('chainChanged', () => window.location.reload());
            }
        };
    }, []);

    return (
        <Web3Context.Provider value={{
            account,
            provider,
            signer,
            factoryContract,
            isConnecting,
            chainId,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}