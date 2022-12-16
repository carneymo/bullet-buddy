import React from "react";

const smallSpace = "\u2006"; // 1/6 em space [same as thinspace: \u2009]
// const midSpace = "\u2005"; // 1/4 em space
// const normalSpace = " ";
const largeSpace = "\u2004"; // 1/3 em space (thick space)

/**
 * Bullet Output Viewer Bullet
 */
class BulletOutputViewerBullet extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      idealHeight: null,
      idealWidth: null,
      optimized: false,
      bulletText: null,
    };
    this.processing = false;
    this.processed = false;
  }

  /**
   * Component Did Mount
   */
  componentDidMount() {
    this.setState({ bulletText: this.props.bulletText });
  }

  /**
   * Component Did Update
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentBulletText } = this.state;
    const { width } = this.props;

    let newBulletText =
      prevState.bulletText !== currentBulletText && currentBulletText !== null;

    // We have a props update, clear everything and start over
    if (
      this.props.bulletText !== prevProps.bulletText ||
      width !== prevProps.width
    ) {
      this.processing = false;
      this.processed = false;
      this.setState({ bulletText: this.props.bulletText, optimized: false });
    } else if (newBulletText && !this.processing && !this.processed) {
      this.optimizeBullet();
      this.props.handleBulletChange(this.state.bulletText, this.props.index);
    }
  }

  /**
   * X to Pixel
   * @param x
   * @returns {number}
   */
  xToPx = (x) => {
    let div = document.createElement("div");
    div.style.display = "block";
    div.style.height = x;
    document.body.appendChild(div);
    let px = parseFloat(window.getComputedStyle(div, null).height);
    div.parentNode.removeChild(div);
    return px;
  };

  /**
   * Evaluate Bullet
   * @returns {{widthDiff: number}}
   */
  evaluateBullet = () => {
    if (this.ref !== null) {
      const node = this.ref.current;
      const parentNode = node.parentNode;

      let idealWidth = this.xToPx(this.props.width);
      let oldPWidth = parentNode.style.width;
      parentNode.style.width = "800.00mm";

      const { width } = node.getBoundingClientRect();
      parentNode.style.width = oldPWidth;

      return { widthDiff: width - idealWidth };
    }
  };

  /**
   * Get Normal Bullet
   * @param text
   * @returns {string}
   */
  getNormalBullet = (text) => {
    let output = text.split(/\s/);
    output.shift(); // remove hyphen then add later
    output = output.join(" ");
    return "- " + output.trim();
  };

  /**
   * Get Smallest Bullet
   * @param text
   * @returns {string}
   */
  getSmallestBullet = (text) => {
    let output = text.split(/\s/);
    output.shift(); // remove hyphen then add later
    output = output.join(smallSpace);
    return "- " + output.trim();
  };

  /**
   * Get Largest Bullet
   * @param text
   * @returns {string}
   */
  getLargestBullet = (text) => {
    let output = text.split(/\s/);
    output.shift(); // remove hypen then add later
    output = output.join(largeSpace);
    return "- " + output.trim();
  };

  /**
   * Set STate Async
   * @param state
   * @returns {Promise<unknown>}
   */
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  /**
   * Optimize Bullet
   * @returns {Promise<string|string>}
   */
  async optimizeBullet() {
    let bullet = this.state.bulletText;
    if (bullet === null) {
      return;
    }
    this.processing = true;
    // console.log("building bullet: " + bullet);
    bullet = this.getNormalBullet(bullet);
    await this.setStateAsync({ bulletText: bullet });
    let prevEval = this.evaluateBullet();
    let prevBullet = bullet;
    let grow = true;

    if (prevEval.widthDiff > -0.02 && prevEval.widthDiff < 0) {
      // We are withing 1mm already
      // console.log("Bullet Already Optimized");
      this.processed = true;
      this.processing = false;
      this.setState({ bulletText: bullet, optimized: true });
      return;
    }

    if (prevEval.widthDiff > 0) {
      // shrink bullet
      // console.log("Shrinking Bullet: " + bullet);
      grow = false;
    } else {
      // console.log("Shrinking Bullet: " + bullet);
    }

    let spaceIndexes = [];

    // Find position of all space chars
    Array.from(bullet).forEach((word, i) => {
      if (word.match(/\s/)) {
        spaceIndexes.push(i);
      }
    });

    // Remove the first space since we dont want to add one after hyphen
    spaceIndexes.shift();

    let terminate = false;
    let useIndex = [];
    let action = 0;
    let len = spaceIndexes.length;
    let optimal = true;

    // Shuffle up the space replacement
    for (let i = 0; i < len; i++) {
      switch (action) {
        case 0:
          useIndex.push(spaceIndexes.shift());
          break; // change space towards Beginning

        case 1:
          useIndex.push(spaceIndexes.pop());
          break; // Change space towards end

        case 2:
          let val = spaceIndexes.splice(Math.floor(spaceIndexes.length / 2), 1);
          useIndex.push(val[0]);
          break; // Change space in the middle

        default:
          break;
      }
      action += 1;
      if (action === 3) {
        action = 0;
      }
    }

    while (!terminate) {
      if (useIndex.length === 0) {
        // console.log("exhausted all index values");
        terminate = true;
        optimal = false;
        continue;
      }

      const space = grow ? largeSpace : smallSpace;

      // Replace the index with the appropriate space char
      let i = useIndex.shift();
      bullet = bullet.substring(0, i) + space + bullet.substring(i + 1);

      // Re-evaluate the size attributes
      await this.setStateAsync({ bulletText: bullet });
      let currentEval = this.evaluateBullet();

      if (grow) {
        // IF we are still short of the line
        if (currentEval.widthDiff < 0) {
          // Still room to go.
          prevEval = currentEval;
          prevBullet = bullet;
          continue;
        }
        // If we past the line
        if (currentEval.widthDiff > 0) {
          // Grew to big keep the old bullet
          bullet = prevBullet;
          terminate = true;
          optimal = true;
        }
      } else {
        if (currentEval.widthDiff > 0) {
          prevEval = currentEval;
          prevBullet = bullet;
          continue;
        }

        if (currentEval.widthDiff < 0) {
          optimal = true;
          terminate = true;
        }
      }
    }

    // If we get here we should be optimized!
    this.processed = true;
    this.processing = false;
    this.setState({ bulletText: bullet, optimized: optimal });

    return bullet;
  }

  /**
   * Tweak
   * @param sentence
   * @returns {*}
   */
  tweak = (sentence) => {
    // adds a 0-width space (\u200B) after forward slashes to cause them to wrap
    sentence = sentence.replace(/(\w)\//g, "$1/\u200B");

    // adds a non-breaking dash (\u2011) instead of a dash to prevent wrapping
    sentence = sentence.replace(/-/g, "\u2011");
    return sentence;
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    const { optimized } = this.state;
    let className = optimized
      ? "bullet-output-bullet optimized"
      : "bullet-output-bullet notoptimized";
    return (
      <div className={className} ref={this.ref}>
        {this.state.bulletText}
      </div>
    );
  }
}

export default BulletOutputViewerBullet;
