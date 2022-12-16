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
      acronyms: this.props.acronyms,
    };
    this.ref = React.createRef();
  }

  /**
   * Extract Acronyms
   * @returns {string|*}
   */
  extractAcronyms = () => {
    const { text, acronyms } = this.props;
    if (text === null) {
      return [];
    }
    let acs = text.match(/[A-Z]+[A-Z\\/0-9]+/g);
    if (acs === null) {
      return [];
    }
    acs = acs.sort().map((term) => {
      return {
        acronym: term,
        options: this.acronymDefinitions(term),
        definition: _.find(acronyms, { acronym: term })?.definition ?? "",
      };
    });
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
   * Update Acronym
   * @param {*} target
   */
  updateAcronym = (acronym) => {
    if (typeof acronym == "undefined" || acronym === "") {
      return;
    }
    let newStateAcs = this.state.acronyms;
    let index = _.findIndex(newStateAcs, { acronym: acronym.acronym });
    newStateAcs[index].definition = acronym.definition;

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
      <AcronymDropdown acronyms={acronyms} updateAcronym={this.updateAcronym} />
    );
  }
}

export default AcronymTable;
