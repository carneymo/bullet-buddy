import React from "react";
import { HotTable } from "@handsontable/react";

const tableSettings = {
  columns: [
    {
      data: "value",
      type: "text",
    },
    {
      data: "abbr",
      type: "text",
    },
  ],
  stretchH: "all",
  width: 500,
  autoWrapRow: true,
  height: 500,
  maxRows: Infinity,
  manualRowResize: true,
  manualColumnResize: true,
  rowHeaders: false,
  colHeaders: ["Word", "Abbreviation"],
  trimWhitespace: false,
  enterBeginsEditing: false,
  manualRowMove: true,
  manualColumnMove: true,
  columnSorting: {
    indicator: true,
  },
  autoColumnSize: false,
  minRows: 2,
  minSpareRows: 1,
  contextMenu: true,
  licenseKey: "non-commercial-and-evaluation",
  search: {
    queryMethod: function (queryStr, value) {
      return queryStr.toString() === value.toString();
    },
    callback: function (instance, row, col, value, result) {
      const DEFAULT_CALLBACK = function (instance, row, col, data, testResult) {
        instance.getCellMeta(row, col).isSearchResult = testResult;
      };
      DEFAULT_CALLBACK.apply(this, arguments);
    },
  },
};

/**
 * Abbreviation Table
 *
 * Table for adding substitutable abbreviations.
 * Ex: Squadron -> Sq
 */
class AbbreviationTable extends React.Component {

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Handle Change
   * @param e
   */
  handleChange = (e) => {
    if (e === null) {
      return;
    }
    this.props.onAbbrevitionDataChange(e);
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    const { abbreviationData } = this.props;
    return (
      <HotTable
        className={"abbreviation-table"}
        settings={tableSettings}
        data={abbreviationData}
        afterChange={this.handleChange}
      />
    );
  }
}

export default AbbreviationTable;