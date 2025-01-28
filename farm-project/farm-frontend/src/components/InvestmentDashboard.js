import React, { useState, useEffect } from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import { useWeb3 } from '../contexts/Web3Context';
import { UserBehaviorAnalyzer, InvestmentAdvisor, RiskMonitor } from '../services';

export function InvestmentDashboard() {
    const { account, farms } = useWeb3();
    const [userProfile, setUserProfile] = useState(null);
    const [poolAnalytics, setPoolAnalytics] = useState([]);
    const [riskAlerts, setRiskAlerts] = useState([]);

    useEffect(() => {
        if (account) {
            initializeAnalytics();
        }
    }, [account]);

    async function initializeAnalytics() {
        try {
            // 初始化分析器
            const analyzer = new UserBehaviorAnalyzer();
            const profile = await analyzer.analyzeUserBehavior(account);
            setUserProfile(profile);

            // 获取投资建议
            const advisor = new InvestmentAdvisor(profile);
            const analytics = await advisor.analyzePools();
            setPoolAnalytics(analytics);

            // 设置风险监控
            const monitor = new RiskMonitor();
            for (const farmAddress of farms) {
                const alerts = await monitor.monitorFarm(farmAddress);
                setRiskAlerts(prev => [...prev, ...alerts]);
            }
        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    return (
        <VStack spacing={6}>
            {/* 用户画像展示 */}
            <UserProfileCard profile={userProfile} />
            
            {/* 投资建议列表 */}
            <PoolAnalyticsList analytics={poolAnalytics} />
            
            {/* 风险警报 */}
            <RiskAlertPanel alerts={riskAlerts} />
        </VStack>
    );
}

// 子组件
function UserProfileCard({ profile }) {
    if (!profile) return null;
    
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontSize="xl">Investment Profile</Text>
            <Text>Risk Tolerance: {profile.riskTolerance}</Text>
            <Text>Total Investment: ${profile.investmentSize}</Text>
            <Text>Average Holding Time: {profile.averageHoldingTime} days</Text>
        </Box>
    );
}