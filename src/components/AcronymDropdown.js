import { Autocomplete, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
var _ = require("lodash");

class AcronymDropdown extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleChangeEvent = (term, value) => {
    if (value === null) {
      value = "";
    }
    let acronym = {
      acronym: term,
      definition: value,
    };
    this.props.updateAcronym(acronym);
  };

  render() {
    let debounceChangeHandler = _.debounce(this.handleChangeEvent, 500);
    return this.props.acronyms.map((acs, i) => {
      return (
        <div key={acs.acronym} className={"acronym-dropdown"}>
          <Stack spacing={2} sx={{ width: 400, m: 2 }}>
            <Autocomplete
              options={acs.options}
              freeSolo
              onChange={(e, val) => debounceChangeHandler(acs.acronym, val)}
              value={acs.definition}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={acs.acronym}
                  label={acs.acronym}
                  onChange={(e) => {
                    debounceChangeHandler(acs.acronym, e.target.value);
                  }}
                  size={"small"}
                  value={acs.definition}
                  acronym={acs.acronym}
                />
              )}
            />
          </Stack>
        </div>
      );
    });
  }
}

export default AcronymDropdown;
