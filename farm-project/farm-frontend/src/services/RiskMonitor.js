class RiskMonitor {
    constructor() {
        this.PRICE_THRESHOLD = 0.1;
        this.TVL_THRESHOLD = 0.2;
    }

    async monitorFarms(farmAddress) {
        const alerts = [];
        const farm = new ethers.Contract(farmAddress, FARM_ABI, provider);

        //monitor price changes
        const priceChage = await this.checkPriceMovement(farm);
        if (Math.abs(priceChange) > this.PRICE_THRESHOLD) {
            alerts.push({
                type: 'price',
                severity: this.calculateSeverity(priceChange),
                message: `Price changed by ${priceChange * 100}%`,
                timestamp: Date.now()
            });
        }

        //monitor TVL changes
        const tvlChange = await this.checkTVLChange(farm);
        if (Math.abs(tvlChange) > this.TVL_THRESHOLD) {
            alerts.push({
                type: 'tvl',
                severity: this.calculateSeverity(tvlChange),
                message: `TVL changed by ${tvlChange * 100}%`,
                timestamp: Date.now()
            });
        }

        return alerts;
    }
    
    //calculate severity based on the change
    calculateSeverity(change) {
        const absChange = Math.abs(change);
        if (absChange > 0.3) return 'high';
        if (absChange > 0.15) return 'medium';
        return 'low';
    }
}