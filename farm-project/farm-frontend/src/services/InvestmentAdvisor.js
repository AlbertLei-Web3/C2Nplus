import { useWeb3 } from "../contexts/Web3Context";
import { FARM_ABI } from "../contracts/abis";

class InvestmentAdvisor {
    constructor(userProfile) {
        this.userProfile = userProfile;
    }

    //analyze pools and return recommendations
    async analyzePools() {
        const { factoryContract, provider } = useWeb3();
        const farms = await factoryContract.getAllFarms();
        
        return Promise.all(
            farms.map(async (farmAddress) => {
                const farm = new ethers.Contract(farmAddress, FARM_ABI, provider);
                
                // 获取池子数据
                const [tvl, rewardRate] = await Promise.all([
                    farm.getTotalValueLocked(),
                    farm.getRewardPerSecond()
                ]);

                // 计算APY
                const apy = this.calculateAPY(tvl, rewardRate);
                // 评估风险
                const riskLevel = this.assessRisk(tvl, apy);
                
                return {
                    address: farmAddress,
                    apy,
                    riskLevel,
                    liquidity: tvl,
                    recommendation: this.generateRecommendation(
                        this.userProfile.riskTolerance,
                        apy,
                        riskLevel
                    )
                };
            })
        );
    }

    //generate recommendation based on user risk tolerance, APY, and pool risk
    generateRecommendation(userRiskTolerance, apy, poolRisk) {
        if (userRiskTolerance === 'low' && poolRisk === 'low') {
            return `This pool matches your conservative investment style with a stable ${apy}% APY`;
        }
        if (userRiskTolerance === 'high' && poolRisk === 'high') {
            return `High yield opportunity matching your risk tolerance. Current APY: ${apy}%`;
        }
        return `Moderate investment option with ${apy}% APY`;
    }
}