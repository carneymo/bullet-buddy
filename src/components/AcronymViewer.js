import React from "react";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";

/**
 * Acronym Viewer
 *
 * Display of Acronyms
 */
class AcronymViewer extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  /**
   * Handle Copy Button Click
   */
  handleCopyButtonClick = () => {
    let range = document.createRange();
    range.selectNode(this.ref.current);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // clear current selection
  };

  /**
   * Extract Acronyms
   * @returns {string|*}
   */
  extractAcronyms = () => {
    const { text } = this.props;
    if (text === null) {
      return "no acronyms yet";
    }
    let acs = text.match(/[A-Z]{2,}/g);
    if (acs === null) {
      return "no acronyms yet";
    }
    acs = acs.sort();
    let alreadyAdded = [];
    acs = acs.map((acs) => {
      if (alreadyAdded.indexOf(acs) === -1) {
        alreadyAdded.push(acs);
        return " (" + acs + "); ";
      }
      return "";
    });
    return acs;
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    const acronyms = this.extractAcronyms();
    return (
      <div>
        <div
          className="bullet-output-container"
          style={{
            width: this.props.width,
          }}
        >
          <p>
            X. REMARKS{" "}
            <mark>(use this section to spell out acronyms from the front)</mark>
          </p>
          <div className="bullet-output-bullet" ref={this.ref}>
            {acronyms}
          </div>
        </div>

        <div style={{ marginTop: "1em" }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={(e) => this.handleCopyButtonClick(e)}
            startIcon={<FileCopyIcon />}
          >
            Copy Acronym List to Clipboard
          </Button>
        </div>
      </div>
    );
  }
}

export default AcronymViewer;
