import {
  Button,
  Heading,
  Text,
  Box,
  Card,
  Grid,
  Row,
  Col,
  ToggleMenu,
  Table,
} from "union-ui";
import {
  Wrapper,
  Avatar,
  ContactDetails,
  ContactsSummaryRow,
  ContactsSummaryRowSkeleton,
} from "components-ui";
import {
  useVouchModal,
  useManageContactModal,
  ManageContactModal,
  EditAliasModal,
  useEditAliasModal,
  EditVouchModal,
  useEditVouchModal,
  VouchModalManager,
} from "components-ui/modals";
import { useState, useEffect } from "react";
import useTrustData from "hooks/data/useTrustData";
import useVouchData from "hooks/data/useVouchData";
import createArray from "util/createArray";
import truncateAddress from "util/truncateAddress";

import { config, ContactsType } from "./config";
import usePublicData from "hooks/usePublicData";

function ContactDetailsHeader({ address, name: passedName, contactsType }) {
  const { name } = usePublicData(address);
  const { open: openManageContactModal } = useManageContactModal();

  return (
    <Box align="center">
      {address && <Avatar size={54} address={address} />}
      <Box direction="vertical" mx="16px">
        <Heading level={2}>{name || passedName}</Heading>
        <Text mb={0}>{address && truncateAddress(address)}</Text>
      </Box>
      {contactsType === ContactsType.YOU_TRUST && (
        <Button
          ml="auto"
          rounded
          variant="secondary"
          label="Manage contact"
          icon="manage"
          onClick={openManageContactModal}
        />
      )}
    </Box>
  );
}

export default function ContactsView() {
  const [contactsType, setContactsType] = useState(ContactsType.TRUSTS_YOU);
  const [selectedContact, setSelectedContact] = useState(null);

  const { isOpen: isManageContactModalOpen } = useManageContactModal();
  const { isOpen: isEditAliasModalOpen } = useEditAliasModal();
  const { isOpen: isEditVouchModalOpen } = useEditVouchModal();
  const { open: openVouchModal } = useVouchModal();

  const { data: trustData } = useTrustData();
  const { data: vouchData } = useVouchData();

  const handleToggleContactType = (item) => {
    if (item.id === contactsType) return;
    setSelectedContact(null);
    setContactsType(item.id);
  };

  useEffect(() => {
    if (!vouchData || !trustData || selectedContact) return;

    if (contactsType === ContactsType.TRUSTS_YOU) {
      setSelectedContact(vouchData[0]);
    } else {
      setSelectedContact(trustData[0]);
    }
  }, [vouchData, trustData, contactsType]);

  const data = contactsType === ContactsType.TRUSTS_YOU ? vouchData : trustData;

  const isLoading = !data;

  return (
    <>
      <Wrapper title={config.title} tabItems={config.tabItems}>
        <Card size="fluid" noGutter className="all-contacts-card">
          <Grid bordered>
            <Row nogutter>
              <Col md={4}>
                <Box>
                  <ToggleMenu
                    items={config.toggleItems}
                    onChange={handleToggleContactType}
                  />
                </Box>
              </Col>
              <Col>
                {selectedContact && (
                  <ContactDetailsHeader
                    {...selectedContact}
                    contactsType={contactsType}
                  />
                )}
              </Col>
            </Row>
            <Row noGutter>
              <Col md={4} noPadding className="contact-summary-col">
                <div className="contact-summary-col-inner">
                  <Table noBorder noPadding mb="20px">
                    {isLoading
                      ? createArray(3).map((_, i) => (
                          <ContactsSummaryRowSkeleton key={i} />
                        ))
                      : [...data, ...data, ...data].map((item, i) => (
                          <ContactsSummaryRow
                            {...item}
                            key={`${i}-${contactsType}`}
                            onClick={setSelectedContact}
                          />
                        ))}
                  </Table>
                </div>

                <div className="contact-summary-vouch-buton">
                  <Box justify="center" mb="24px">
                    <Button
                      rounded
                      icon="vouch"
                      variant="floating"
                      label="Vouch for someone"
                      onClick={openVouchModal}
                    />
                  </Box>
                </div>
              </Col>
              <Col md={8}>
                {selectedContact && (
                  <ContactDetails variant={contactsType} {...selectedContact} />
                )}
              </Col>
            </Row>
          </Grid>
        </Card>
      </Wrapper>

      {/* modals */}
      <VouchModalManager />
      {isManageContactModalOpen && <ManageContactModal {...selectedContact} />}
      {isEditAliasModalOpen && <EditAliasModal {...selectedContact} />}
      {isEditVouchModalOpen && <EditVouchModal {...selectedContact} />}
    </>
  );
}