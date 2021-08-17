import { Fragment } from "react";
import StatsNavigation from "components/stats/StatsNavigation";
import StatsCard from "components/stats/StatsCard";
import StatsGrid from "components/stats/StatsGrid";
import StatsHeader from "components/stats/StatsHeader";
import useAssetManagerStats from "hooks/stats/assetManagerStats";
import { formatDetailed } from "util/formatValue";

export default function AssetManagerStatsView() {
  const {
    loanableAmount,
    poolBalance,
    assetManagerDAIBalance,
    daiInLendingProtocols,
    daiInCompound,
    compoundFloor,
    compoundCeiling,
    daiInAave,
    aaveFloor,
    aaveCeiling,
    daiInPureAdapter,
    pureFloor,
    pureCeiling,
  } = useAssetManagerStats();

  return (
    <Fragment>
      <section className="mb-8">
        <div className="container">
          <StatsHeader />
          <StatsNavigation />
        </div>
      </section>

      <section className="mb-8">
        <div className="container">
          <div className="divider" />
        </div>
      </section>

      <section className="mb-8">
        <div className="container">
          <StatsGrid>
            <StatsCard
              label="Available Credit"
              value={formatDetailed(loanableAmount, "DAI")}
            />
            <StatsCard
              label="Pool Balance"
              value={formatDetailed(poolBalance, "DAI")}
            />
            <StatsCard
              label="DAI in Contract"
              value={formatDetailed(assetManagerDAIBalance, "DAI")}
            />
            <StatsCard
              label="DAI In Lending Protocols"
              value={formatDetailed(daiInLendingProtocols, "DAI")}
            />
            <StatsCard
              label="DAI In Compound"
              value={formatDetailed(daiInCompound, "DAI")}
            />
            <StatsCard
              label="DAI In Aave"
              value={daiInAave ? formatDetailed(daiInAave) + " DAI" : "NaN"}
            />
            <StatsCard
              label="DAI In Pure Adapter"
              value={formatDetailed(daiInPureAdapter, "DAI")}
            />
            <StatsCard
              label="Pure Adapter Floor"
              value={formatDetailed(pureFloor, "DAI")}
            />
            <StatsCard
              label="Pure Adapter Ceiling"
              value={formatDetailed(pureCeiling, "DAI")}
            />
            <StatsCard
              label="Aave Floor"
              value={formatDetailed(aaveFloor, "DAI")}
            />
            <StatsCard
              label="Aave Ceiling"
              value={formatDetailed(aaveCeiling, "DAI")}
            />
            <StatsCard
              label="Compound Floor"
              value={formatDetailed(compoundFloor, "DAI")}
            />
            <StatsCard
              label="Compound Ceiling"
              value={formatDetailed(compoundCeiling, "DAI")}
            />
          </StatsGrid>
        </div>
      </section>
    </Fragment>
  );
}