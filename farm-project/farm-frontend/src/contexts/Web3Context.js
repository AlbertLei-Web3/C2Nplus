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
    const [farms, setFarms] = useState([]);

    // 连接钱包 connect wallet
    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const account = await signer.getAddress();

                setProvider(provider);
                setSigner(signer);
                setAccount(account);

                // 初始化合约 initialize contract
                const factory = new ethers.Contract(
                    FACTORY_ADDRESS,
                    FACTORY_ABI,
                    signer
                );
                setFactoryContract(factory);

                // 加载农场列表 load farms
                loadFarms(factory);
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    // 加载农场列表
    const loadFarms = async (factory) => {
        try {
            const farmAddresses = await factory.getAllFarms();
            setFarms(farmAddresses);
        } catch (error) {
            console.error("Error loading farms:", error);
        }
    };

    // 监听账户变化 listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                }
            });
        }
    }, []);

    return (
        <Web3Context.Provider value={{
            account,
            provider,
            signer,
            factoryContract,
            farms,
            connectWallet
        }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
}