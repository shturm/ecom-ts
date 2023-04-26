import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import _ from "lodash";

export interface IFilterProps {
  label: string;
  items: Array<string>;
  onChangeCallback: (item: string[]) => void;
}

export function Filter(props: IFilterProps) {
  const [items, setItems] = React.useState(props.items);
  const [displayValue, setDisplayValue] = React.useState<string[]>([]);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  // const onChange = (value: any) => {
  //   const index = _.findIndex(items, {value: value});
  //   setSelected(items[index]);
  //   props.onChangeCallback(items[index]);
  // };

  const handleChange = (event: SelectChangeEvent<typeof displayValue>) => {
    const {
      target: { value },
    } = event;
    setDisplayValue( typeof value === "string" ? value.split(",") : value );
    props.onChangeCallback(typeof value === "string" ? [value] : value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <React.Fragment>
      <Grid
        item
        lg={4}
        md={4}
        sm={12}
        sx={
          {
            // background: 'dark'
          }
        }
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
          <Select
            multiple={true}
            input={<OutlinedInput label={props.label} />}
            MenuProps={MenuProps}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={displayValue}
            label={props.label}
            onChange={handleChange}
          >
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Box></Box>
    </React.Fragment>
  );
}
