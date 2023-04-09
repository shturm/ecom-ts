import { Box, Typography } from "@mui/material";
import * as React from "react";

export interface IProductDescriptionDetailProps {
  label: string;
  value: string | Array<string>;
}

interface IDefaultValueProps {
  label: string;
  value: Array<string> | string;
}

const DetailValue = (props: IDefaultValueProps) => {
  if (Array.isArray(props.value)) {
    return (
      <ul>
        {props.value.map((x) => (
          <li key={`${x}-${props.label}`}>{x}</li>
        ))}
      </ul>
    );
  } else {
    return <React.Fragment>{props.value}</React.Fragment>;
  }
};

export function ProductDescriptionDetail(
  props: IProductDescriptionDetailProps
) {
  return (
    <React.Fragment>
      <Box mb={2}>
        <Typography variant="h5">{props.label}</Typography>
        <DetailValue value={props.value} label={props.label} />
      </Box>
    </React.Fragment>
  );
}
