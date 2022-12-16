import React from "react";
import Button from "@mui/material/Button";
import FileCopyIcon from "@mui/icons-material/FileCopy";
var _ = require("lodash");

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
   * Render
   * @returns {JSX.Element}
   */
  render() {
    let acronyms = this.props.acronyms;
    acronyms = _.sortBy(acronyms, ["acronym"], ["asc"]);
    let acroynmOutput = _.map(acronyms, (term) => {
      if (term.definition !== "") {
        return term.acronym + " - " + term.definition + "; ";
      }
    });
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
            {acroynmOutput}
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
