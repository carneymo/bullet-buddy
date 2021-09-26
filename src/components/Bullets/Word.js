import React from "react";
import Axios from "axios";
import Synonym from "./Synonym";

/**
 * Word
 */
class Word extends React.Component {
  previousLookup = {};
  handleTimeout = null;

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      synonyms: null,
      isEditable: null,
    };

    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
  }

  /**
   * Handle Popover Open
   */
  handlePopoverOpen = () => {
    this.handleTimeout = setTimeout(() => {
      this.getSynonyms(this.props.value);
      this.setState({ open: true });
    }, 300);
  };

  /**
   * Handle Popover Close
   */
  handlePopoverClose = () => {
    clearTimeout(this.handleTimeout);
    this.setState({ open: false });
  };

  /**
   * Handle Synonym Click
   * @param synonym
   * @param parentIndex
   */
  handleSynonymClick = (synonym, parentIndex) => {
    this.setState({
      open: false,
      value: synonym,
      synonyms: [],
    });
    this.props.changeWord(synonym, parentIndex);
  };

  /**
   * Is Not Editable
   * @param word
   * @returns {boolean}
   */
  isNotEditable = (word) => {
    return Boolean(
      (word.match(/([A-Z]{3,})/) != null) |
        (word.match(/([0-9])/) != null) |
        (word.length <= 3) |
        (this.props.index < 1)
    );
  };

  /**
   * Get Abbreviations
   * @param word
   * @returns {null|*}
   */
  getAbbreviations = (word) => {
    if (this.props.abbreviationData === null) {
      return null;
    }
    // extract dictionary
    const abbreviation = this.props.abbreviationData.find(
      (row) =>
        (row.abbr === word.toLowerCase()) |
        (row.value.toLowerCase() === word.toLowerCase())
    );

    return typeof abbreviation === "undefined" ? null : abbreviation;
  };

  /**
   * Get Synonyms
   * @param word
   */
  getSynonyms = (word) => {
    if (word in this.previousLookup) {
      return this.previousLookup[word];
    } else {
      if (word.length > 3) {
        Axios.get("https://api.datamuse.com/words?max=15&ml=" + word)
          .then((res) => {
            if (res.status === 200) {
              const data = res.data;
              if (data.length !== 0) {
                const all = data.map((item) => {
                  return item.word;
                });
                this.setState({ synonyms: all });
                this.previousLookup[word] = all;
              }
            } else {
              this.setState({ synonyms: [] });
            }
          })
          .catch((err) => {
            console.log(`ERR: ${JSON.stringify(err)}`);
          });
      } else {
        this.setState({ synonyms: [] });
      }
    }
  };

  /**
   * Component Did Mount
   */
  componentDidMount() {
    if (this.isNotEditable(this.props.value)) {
      this.setState({ isEditable: false });
    } else {
      this.setState({ isEditable: true });
    }
  }

  /**
   * Component Did Update
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.value !== prevProps.value && this.state.isEditable) {
      this.getSynonyms(this.props.value);
    }
  }

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    let word = this.props.value;

    let dynamicClassName = "bullet-editor-word-editable";

    // Check if able to be abbreviated
    const abbrvData = this.getAbbreviations(word);

    if (abbrvData !== null) {
      if (abbrvData.value.toLowerCase() === word.toLowerCase()) {
        // Word can be Abbreviated
        dynamicClassName = dynamicClassName + " abbreviated popup";
        return (
          <span
            className={dynamicClassName}
            onMouseEnter={this.handlePopoverOpen}
            onMouseLeave={this.handlePopoverClose}
          >
            {word}
            <span className={this.state.open ? "popuptext show" : "popuptext"}>
              <ul className="popuptextlist">
                <li
                  className="synonym-button"
                  onClick={() =>
                    this.props.changeWord(
                      abbrvData.abbr,
                      this.props.parentIndex
                    )
                  }
                >
                  {abbrvData.abbr}
                </li>
              </ul>
            </span>
          </span>
        );
      }

      if (abbrvData.abbr === word) {
        // Already abbreviated word
        dynamicClassName = dynamicClassName + " approved-abbreviation popup";
        return (
          <span
            className={dynamicClassName}
            onMouseEnter={this.handlePopoverOpen}
            onMouseLeave={this.handlePopoverClose}
          >
            {word}
            <span className={this.state.open ? "popuptext show" : "popuptext"}>
              <ul className="popuptextlist">
                <li
                  className="synonym-button"
                  onClick={() =>
                    this.props.changeWord(
                      abbrvData.value.toLowerCase(),
                      this.props.parentIndex
                    )
                  }
                >
                  {abbrvData.value}
                </li>
              </ul>
            </span>
          </span>
        );
      }
    }

    if (this.isNotEditable(word)) {
      dynamicClassName = "bullet-editor-word popup";
      return <span className={dynamicClassName}>{word}</span>;
    }

    dynamicClassName = dynamicClassName + " popup";

    let synList = null;
    if (this.state.synonyms !== null) {
      synList = this.state.synonyms.map((syn) => (
        <Synonym
          key={syn}
          className="synonym-button"
          parentIndex={this.props.parentIndex}
          synonym={syn}
          onClick={() => this.handleSynonymClick(syn, this.props.parentIndex)}
        />
      ));
    }

    return (
      <span
        className={dynamicClassName}
        onMouseEnter={this.handlePopoverOpen}
        onMouseLeave={this.handlePopoverClose}
      >
        {word}
        <span className={this.state.open ? "popuptext show" : "popuptext"}>
          <ul className="popuptextlist">{synList}</ul>
        </span>
      </span>
    );
  }
}

export default Word;
