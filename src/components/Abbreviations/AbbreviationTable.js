import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton
} from "@mui/x-data-grid";

import MilitaryDictionary from "./militaryTerms.json";

class AbbreviationTable extends React.Component {
  constructor(props) {
    super(props);
  }

  CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  render() {
    const columns = [
      { field: "id", headerName: "ID", width: 35, hide: true, filterable: false },
      { field: "term", headerName: "Term", width: 180 },
      { field: "definition", headerName: "Definition", width: 300 },
      { field: "source", headerName: "Source", width: 200, hide: true, filterable: false },
    ];

    return (
      <div style={{ height: 500, width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid
            density="compact"
            components={{
              Toolbar: this.CustomToolbar,
            }}
            rows={MilitaryDictionary}
            columns={columns}
            pagination
          />
        </div>
      </div>
    );
  }
}

export default AbbreviationTable;
