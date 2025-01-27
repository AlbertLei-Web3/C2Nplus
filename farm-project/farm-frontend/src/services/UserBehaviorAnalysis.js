import { FARM_ABI } from "../contracts/abis";

class UserBehaviorAnalysis {
    async analyzeUserBehavior(userAddress) {
        const { factoryContract, provider } = useWeb3();

        //get user's all farm history
        const farms = await factoryContract.getAllFarms();
        const userActions = await Promise.all(
            farms.map(async (farmAddress) => {
                const farm = new ethers.Contract(farmAddress, FARM_ABI, provider);
                return {
                    deposits: await farm.getUserDeposits(userAddress),
                    withdrawals: await farm.getUserWithdrawals(userAddress),
                    rewards: await farm.getUserRewards(userAddress)
                };
            })
        );
        
        //Analyze user risk appetite
        return this.calculateUserProfile(userActions);
    }

    calculateUserProfile(actions) {
        //calculated risk tolerance based on user behavior
        const riskTolerance = this.calculateRiskTolerance(actions);
        //calculate average holding time
        const holdingTime = this.calculateHoldingTime(actions);

        return {
            riskTolerance,
            investmentSize: this.calculateTotalInvestment(actions),
            preferredPools: this.findPreferredPools(actions),
            averageHoldingTime: holdingTime
        };
    }

    calculateRiskTolerance(actions) {
        //Calculate risk tolerance based on investment behavior
        let riskScore = 0;

        actions.forEach(action => {
            //analyze investment size
            const investmentSize = action.deposits.reduce((a, b) => a + b, 0); 
            //analyze investment frequency
            const investmentFrequency = action.deposits.length;
            //calculate risk score
            riskScore += (investmentSize * investmentFrequency) / 1000; //scale down for better granularity
        });

        //return risk level based on risk score
        if (riskScore < 50) return 'low';
        if (riskScore < 100) return 'medium';
        return 'high';
    }
}