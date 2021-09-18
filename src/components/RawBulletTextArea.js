import React from "react";

/**
 * Input Bullet Text Area
 */
class InputBulletTextArea extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Component Did Mount
   */
  componentDidMount() {}

  /**
   * Text Area Update
   * @param event
   */
  textAreaUpdate = (event) => {
    this.setState({ text: event.target.value });
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {

    const widthSettings = {
      EPR: "202.321mm",
      OPR: "201.041mm",
    };

    return (
      <textarea
        rows={5}
        value={this.state.text}
        onChange={this.textAreaUpdate}
        className="bullet-text"
        style={{
          width: widthSettings[this.props.bulletType],
          resize: "none",
        }}
      />
    );
  }
}

export default InputBulletTextArea;
