import React from "react";

/**
 *
 */
class Synonym extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
  }

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