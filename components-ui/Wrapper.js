import { Layout, Box, Grid, Row, Col, ContextMenu, Label } from "union-ui";
import { useWeb3React } from "@web3-react/core";
import { Wallet, Navigation, ConnectButton, UnionWallet } from "components-ui";
import { useClaimModal, ClaimModal } from "components-ui/modals";
import useInactiveListener from "hooks/useInactiveListener";
import { useUpdateForceConnect } from "hooks/useForceConnect";
import { contextMenuItems } from "constants/app";

export function Wrapper({ children }) {
  useInactiveListener();

  useUpdateForceConnect();

  const { account } = useWeb3React();

  const { isOpen: isClaimModalOpen } = useClaimModal();

  return (
    <>
      <Layout>
        <Layout.Main>
          <Grid style={{ display: "flex", flexGrow: 1 }}>
            <Row style={{ width: "100%", margin: 0 }}>
              <Col>
                <Layout.Header align="center">
                  <Navigation />
                  <Box align="center">
                    <Box mr="4px">
                      {account ? (
                        <>
                          <UnionWallet />
                          <Wallet />
                        </>
                      ) : (
                        <ConnectButton
                          label="Connect wallet"
                          variant="secondary"
                        />
                      )}
                    </Box>
                    <ContextMenu position="left" items={contextMenuItems} />
                  </Box>
                </Layout.Header>
                <Box
                  fluid
                  align="center"
                  direction="vertical"
                  className="inner-wrapper"
                >
                  {children}
                </Box>
              </Col>
            </Row>
          </Grid>
          <Box mt="auto" w="100%">
            <Box mt="40px" mb="16px" justify="center" fluid>
              <Label as="p" size="small" grey={300} align="center">
                Build: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
              </Label>
            </Box>
          </Box>
        </Layout.Main>
      </Layout>
      {isClaimModalOpen && <ClaimModal />}
    </>
  );
}
