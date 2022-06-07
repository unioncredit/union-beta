import { forwardRef } from "react";
import { formatUnits } from "@ethersproject/units";
import { Text, TableCell, TableRow, Skeleton, Box } from "@unioncredit/ui";

import format from "util/formatValue";
import { Avatar, Dai } from "components-ui";
import usePublicData from "hooks/usePublicData";
import useAddressLabels from "hooks/useAddressLabels";

export const CreditContactsRow = forwardRef((props, ref) => {
  const { address, trust, onClick } = props;
  const { name, ...publicData } = usePublicData(address);
  const { getLabel } = useAddressLabels();

  const label = getLabel(address);

  const handleClick = (event) => {
    if (typeof onClick === "function") {
      onClick(event, { ...props, name, ...publicData });
    }
  };

  return (
    <TableRow onClick={onClick && handleClick} ref={ref}>
      <TableCell fixedSize>
        <Avatar address={address} />
      </TableCell>
      <TableCell>
        <Text>{label || name}</Text>
      </TableCell>
      <TableCell align="right">
        <Text grey={700}>
          <Dai value={format(formatUnits(trust))} />
        </Text>
      </TableCell>
    </TableRow>
  );
});

export function CreditContactsRowSkeleton() {
  return (
    <TableRow>
      <TableCell fixedSize>
        <Skeleton variant="circle" size={24} grey={200} />
      </TableCell>
      <TableCell span={2}>
        <Skeleton width={100} height={10} grey={200} ml="8px" />
      </TableCell>
      <TableCell>
        <Skeleton width={30} height={10} grey={200} ml="auto" />
      </TableCell>
    </TableRow>
  );
}
