import React from "react";
import Bullet from "./Bullet";

/**
 * Bullet Editor
 */
class BulletEditor extends React.Component {
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
    this.updateBulletText = this.updateBulletText.bind(this);
  }

  /**
   * Component Did Mount
   */
  componentDidMount() {
    this.setState({
      bullets: this.extractBullets(this.props.inputBullets),
    });
  }

  /**
   * Component Did Update
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.inputBullets !== prevProps.inputBullets) {
      this.setState({ bullets: this.extractBullets(this.props.inputBullets) });
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
      return "- " + bullet.trim();
    });
    return bullets;
  };

  /**
   * Update Bullet Text
   * @param newText
   * @param i
   */
  updateBulletText = (newText, i) => {
    let bullets = this.state.bullets;
    bullets[i] = newText;
    bullets.join(" ");
    bullets[i] = bullets[i].replace(/\s;\s/, ";");
    bullets[i] = bullets[i].replace(/\s-{2}\s/, "--");
    bullets[i] =
      "- " + bullets[i].charAt(2).toUpperCase() + bullets[i].slice(3);
    this.props.updateInputText(bullets.join("\n"));
  };

  /**
   * On Change
   * @param e
   * @param i
   */
  onChange = (e, i) => {
    let c = e.nativeEvent.target.childNodes;
    c = Array.from(c).map((node) => {
      return node.innerText;
    });
    this.updateBulletText(c.join(" "), i);
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    return (
      <div>
        <div className="bullet-editor" style={{ width: this.props.width }}>
          {this.state.bullets.map((bullet, i) => {
            return (
              <div className="bullet-editor-bullet"
                   key={`bullet${i}`}>
                <Bullet
                  text={bullet}
                  parentIndex={i}
                  updateBulletText={this.updateBulletText}
                  abbreviationData={this.props.abbreviationData}
                />
              </div>
            );
          })}
        </div>
        <div className="legend">
          Legend:
          <span className="approved-abbreviation">Approved Abbreviation</span>
          <span className="abbreviatable">Abbreviatable Word</span>
        </div>
      </div>
    );
  }
}

export default BulletEditor;