import React from "react";
import AcronymDropdown from "./AcronymDropdown";

import MilitaryDictionary from "./Abbreviations/militaryTerms.json";
var _ = require("lodash");

/**
 * Acronym Table
 *
 * Display of Acronyms
 */
class AcronymTable extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      acronyms: [],
    };
    this.ref = React.createRef();
  }

  /**
   * If empty acronym table, update from passed in acronyms
   */
  componentDidUpdate() {
    if (this.state.acronyms?.length === 0 && this.props?.acronyms?.length > 0) {
      this.setState({ acronyms: this.props.acronyms });
    } else if (
      this.state.acronyms?.length === 0 &&
      this.props?.acronyms?.length === 0
    ) {
      let newAcronyms = this.extractAcronyms();
      this.setState({
        acronyms: newAcronyms,
      });
    }
  }

  /**
   * Extract Acronyms
   * Create Array of acronym objects
   * Find matching terms in military dictionary as options
   * Find already supplied definitions as definition selected
   * @returns {string|*}
   */
  extractAcronyms = () => {
    let { text } = this.props;
    // Empty text, return empty acronym list
    if (text === null) {
      return [];
    }
    // Match acronym pattern, return empty list if none found
    let acs = text.match(/[A-Z]+[A-Z\\/0-9-]*[A-Z0-9]+/g);
    if (acs === null) {
      return [];
    }

    // Create array of acronym objects
    let acronyms = this.state.acronyms;
    acs = acs.sort().map((term) => {
      return {
        // Acronym as string (eg. "APT")
        acronym: term,
        // Options as array of strings (eg. ["Apple Berry Cherry", "Amber Blue Clear"])
        options: this.acronymDefinitions(term),
        // Selected definition
        definition: _.find(acronyms, { acronym: term })?.definition ?? "",
      };
    });

    // In case of multiple uses of same acronym, this removes them
    acs = _.uniqBy(acs, "acronym");
    return acs;
  };

  /**
   * Return Definitions of Acronyms
   * @param {*} acronym
   * @returns
   */
  acronymDefinitions = (acronym) => {
    let foundDefinitions = [];
    let definitions = _.filter(MilitaryDictionary, (row) => {
      let definition = _.startCase(row.definition);
      if (row.term === acronym && !_.includes(foundDefinitions, definition)) {
        foundDefinitions.push(definition);
        return row.definition;
      }
    }).map((row) => {
      return _.startCase(row.definition);
    });
    return definitions;
  };

  /**
   * Save Acronym
   * @param {*} acronym
   * @returns
   */
  saveAcronym = (acronym) => {
    if (typeof acronym == "undefined" || acronym === "") {
      return;
    }
    let newStateAcs = this.state.acronyms;
    let index = _.findIndex(newStateAcs, { acronym: acronym.acronym });
    if (index >= 0) {
      newStateAcs[index].definition = acronym.definition;
    }
    this.setState({ acronyms: newStateAcs });
    this.props.updateAcronymView(newStateAcs);
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    let acronyms = this.extractAcronyms();
    return (
      <AcronymDropdown acronyms={acronyms} saveAcronym={this.saveAcronym} />
    );
  }
}

export default AcronymTable;
