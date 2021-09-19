import React from "react";

/**
 *
 */
class Synonym extends React.Component {

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    return (
      <li
        key={this.props.synonym + this.props.parentIndex}
        className="synonym-button"
        onClick={this.props.onClick}
      >
        {this.props.synonym}
      </li>
    );
  }

}

export default Synonym;