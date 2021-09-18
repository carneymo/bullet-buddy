import React from "react";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import BulletOutputViewerBullet from "./BulletOutputViewerBullet";

/**
 * Bullet Output Viewer
 */
class BulletOutputViewer extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      bullets: [],
    };
    this.ref = React.createRef();
  }

  /**
   * Component Did Mount
   */
  componentDidMount() {
    //console.log(this.props.bulletsText)
    this.setState({ bullets: this.extractBullets(this.props.bulletsText) });
  }

  /**
   * Component Did Update
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.bulletsText !== prevProps.bulletsText) {
      this.setState({ bullets: this.extractBullets(this.props.bulletsText) });
    }
  }

  /**
   * Extract Bullets
   * @param text
   * @returns {*}
   */
  extractBullets = (text) => {
    let bullets = text.split(/-\s/);
    bullets.shift();
    bullets = bullets.map((bullet) => {
      return "- " + bullet.trim() + "\r\n";
    });
    return bullets;
  };

  /**
   * Handle Selection Copy
   * @param e
   */
  handleSelectionCopy = (e) => {
    e.preventDefault();
    let text = window.getSelection().toString();
    text = this.extractBullets(text);
    text = text.join("");
    text.replace(/\n/g, "\r\n"); //need this for WINDOWS!
    //console.log('Copy event: ' + text)
    e.clipboardData.setData("text/plain", text);
  };

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
   * Handle Bullet Change
   * @param newText
   * @param i
   */
  handleBulletChange = (newText, i) => {
    let bullets = this.state.bullets;
    bullets[i] = newText;
    this.setState({ bullets: bullets });
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    return (
      <div>
        <div
          className="bullet-output-container"
          style={{ width: this.props.width }}
          onCopy={this.handleSelectionCopy}
        >
          <p>
            XX. AMAZING BULLETS{" "}
            <mark>(Don't forget to copy to the right place!)</mark>
          </p>
          <div ref={this.ref}>
            {
              // Create a bullet around each bullet
              this.state.bullets.map((bullet, i) => {
                return (
                  <BulletOutputViewerBullet
                    width={this.props.width}
                    bulletText={bullet}
                    index={i}
                    key={i.toString()}
                    handleBulletChange={this.handleBulletChange}
                  />
                );
              })
            }
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
            Copy Bullets to Clipboard
          </Button>
        </div>
      </div>
    );
  }
}

export default BulletOutputViewer;
