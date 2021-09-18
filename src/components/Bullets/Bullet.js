import React from "react";
import Word from "./Word";

/**
 * Class Bullet
 */
class Bullet extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      indexOfColon: null,
      indexOfDashes: null,
    };
    this.changeWord = this.changeWord.bind(this);
  }

  /**
   * Component Did Mount
   */
  componentDidMount() {}

  /**
   * Component Did Update
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {}

  /**
   * Tokenize
   * @param text
   * @returns {*[]}
   */
  tokenize = (text) => {
    let output = [];

    text.split(/\s/).forEach((seg) => {
      let innerSeg = seg.split(/([/;,-])/);
      if (innerSeg.length === 1) {
        output.push(seg);
        output.push(" ");
      } else {
        innerSeg.forEach((s) => {
          if (s !== "") output.push(s);
        });
        output.push(" ");
      }
    });
    return output;
  };

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
   * Change Word
   * @param newWord
   * @param i
   */
  changeWord = (newWord, i) => {
    let newBullet = this.tokenize(this.props.text);
    newBullet[i] = newWord;
    this.props.updateBulletText(newBullet.join(""), this.props.parentIndex);
  };

  /**
   * Render
   * @returns {unknown[]}
   */
  render() {
    const { text } = this.props;
    return this.tokenize(text).map((word,i) => {
      return (
        <Word
          key={"popup" + i}
          value={word}
          parentIndex={i}
          changeWord={this.changeWord}
          abbreviationData={this.props.abbreviationData}
        />
      );
    });
  }
}

export default Bullet;
