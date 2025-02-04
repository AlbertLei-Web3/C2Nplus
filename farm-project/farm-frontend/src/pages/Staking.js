import React from 'react';
import { Grid } from '@chakra-ui/react';
import StakingPanel from '../components/Farm/StakingPanel'; // 确保你有这个组件
import StakingInfo from '../components/Farm/StakingInfo'; // 确保你有这个组件

function Staking() {
    return (
      <Grid templateColumns="1fr 2fr" gap={8}>
        <StakingPanel />
        <StakingInfo />
      </Grid>
    );
}

export default Staking;