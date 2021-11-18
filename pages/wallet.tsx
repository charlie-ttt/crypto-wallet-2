import { Box, Card, Container, Grid, Typography } from "@mui/material";
import {
  getArbitrumBalance,
  getMainBalance,
  getOptimisticBalance,
  getPolygonBalance,
  getZksyncBalance,
} from "../src/utils/getBalances";

import OverallEthBalance from "../src/components/overall-eth-balance";
import PropTypes from "prop-types";
import SingleEthBalance from "../src/components/single-eth-balance";

function Wallet({ balanceData }) {
  const { main, arbitrum, zksync, optimistic, polygon } = balanceData;
  const totalValue = Object.values(balanceData).reduce((a, b) => a + +b, 0);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography variant="h4">Your ETH Balances</Typography>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          <Grid container xs={12} justifyContent="center">
            <OverallEthBalance balances={balanceData} />
          </Grid>
          <Grid container xs={12} justifyContent="center" sx={{ margin: 5 }}>
            <Card>
              <Box sx={{ padding: 3 }}>
                Combined Eth Balance: {totalValue} ETH
              </Box>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <SingleEthBalance label="Main (Layer 1)" value={main} />
          </Grid>
          <Grid item md={6} xs={12}>
            <SingleEthBalance label="Arbitrum (Layer 2)" value={arbitrum} />
          </Grid>
          <Grid item md={6} xs={12}>
            <SingleEthBalance label="Zksync (Layer 2)" value={zksync} />
          </Grid>
          <Grid item md={6} xs={12}>
            <SingleEthBalance label="Optimistic (Layer 2)" value={optimistic} />
          </Grid>
          <Grid item md={6} xs={12}>
            <SingleEthBalance label="Polygon (Layer 2)" value={polygon} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const balanceData = {
    main: "0",
    zksync: "0",
    arbitrum: "0",
  };
  const { address } = context.query;
  if (!address) {
    return { props: { balanceData } };
  }

  const [
    mainBalance,
    zksyncBalance,
    arbitrumBalance,
    optimisticBalance,
    polygonBalance,
  ] = await Promise.all([
    getMainBalance(address),
    getZksyncBalance(address),
    getArbitrumBalance(address),
    getOptimisticBalance(address),
    getPolygonBalance(address),
  ]);

  balanceData.main = mainBalance;
  balanceData.arbitrum = arbitrumBalance;
  balanceData.zksync = zksyncBalance;
  balanceData.optimistic = optimisticBalance;
  balanceData.polygon = polygonBalance;

  return {
    props: { balanceData },
  };
}

Wallet.propTypes = {
  balanceData: PropTypes.object,
};

export default Wallet;