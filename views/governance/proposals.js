import Link from "next/link";
import { Grid, Card, Button, Box } from "union-ui";
import { View, ProposalsTable } from "components-ui";
import useFilteredProposalData from "hooks/governance/useFilteredProposalData";
import ArrowRight from "union-ui/lib/icons/arrowRight.svg";

export default function ProposalsView() {
  const typeFilter = "all";
  const statusFilter = "all";
  const data = useFilteredProposalData(statusFilter, typeFilter);

  return (
    <View>
      <Grid>
        <Grid.Row justify="center">
          <Grid.Col xs={12} md={8} lg={6}>
            <Box>
              <Link href="/governance">
                <Button
                  variant="lite"
                  label={
                    <>
                      <ArrowRight className="flip" width="24px" height="24px" />
                      Back to overview
                    </>
                  }
                />
              </Link>
            </Box>
            <Card>
              <Card.Header title="All Proposals" />
              <Card.Body>
                <ProposalsTable data={data} />
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </View>
  );
}
