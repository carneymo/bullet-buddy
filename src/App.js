import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { Tab, Tabs } from "@material-ui/core";
import "./styles/css/App.css";
import "./components/RawBulletTextArea";
import BulletEditor from "./components/Bullets/BulletEditor";
import BulletOutputViewer from "./components/Bullets/BulletOutputViewer";
import AcronymViewer from "./components/AcronymViewer";
import AbbreviationTable from "./components/Abbreviations/AbbreviationTable";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

/**
 * App
 */
class App extends React.Component {
  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      bulletInputText:
        "- Action section of bullet should go here; put the how/what you did in this part--bring it home w/ a great impact line\n- This tool can optimize spacing; output will be red if the optimizer could not fix spacing with 2004 or 2006 Unicode spaces",
      abbreviationData: [
        { value: "organizations", abbr: "orgs" },
        { value: "expandable", abbr: "expdble" },
      ],
      abbreviationTable: [
        { value: "organizations", abbr: "orgs" },
        { value: "expandable", abbr: "expdble" },
      ],
      bulletType: "EPR",
      tabValue: 0,
      drawerOpen: false,
      thesaurusViewer: {
        visible: false,
        posX: 0,
        posY: 0,
        wordList: null,
      },
    };
    this.inputTextRef = React.createRef();
    this.handleTextAreaUpdate = this.handleTextAreaUpdate.bind(this);
  }

  /**
   * Component Did Mount
   */
  componentDidMount() {
    const el = document.querySelector(".loader-container");
    if (el) {
      el.remove(); // removing the spinner element
      //this.setState({ loading: false }); // showing the app
    }
  }

  /**
   * Component Did Update
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {}

  /**
   * Save Settings
   * @param settings
   */
  saveSettings = (settings) => {
    try {
      window.localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get Settings
   * @returns {null|any}
   */
  getSettings = () => {
    try {
      if (window.localStorage.getItem("settings")) {
        return JSON.parse(window.localStorage.getItem("settings"));
      }
    } catch (error) {
      console.log(error);
      return null;
    }
    return null;
  };

  /**
   * Set Abbreviation Table
   * @param abbreviationData
   */
  setAbbreviationTable = (abbreviationData) => {
    let newTable = abbreviationData.filter(
      (row) => row.value !== null && row.abbr !== null
    );
    newTable = newTable.map((row) => {
      row.abbr = row.abbr.trim();
      row.value = row.value.trim();
      return row;
    });
    this.setState({ abbreviationTable: newTable });
  };

  /**
   * Handle Text Area Update
   * @param text
   */
  handleTextAreaUpdate = (text) => {
    console.log("Update text with: ");
    console.log(text);
    this.inputTextRef.current.style.height =
      this.inputTextRef.current.scrollHeight + "px";
    this.setState({ bulletInputText: text });
  };

  /**
   * Handle Select
   */
  handleSelect = () => {
    // let selection = window.getSelection();
    // // Get position of text selection
    // let offsetStart = this.inputTextRef.current.selectionStart;
    // let offsetEnd = this.inputTextRef.current.selectionEnd;
    // // Get potion of selection in viewport
    // let x = e.nativeEvent.clientX;
    // let y = e.nativeEvent.clientY;
    // console.log("Start: " + offsetStart + "END: " + offsetEnd + " X: " +x + " Y: " + y);
    // console.log("word: " + selection.toString())
    // if(offsetStart === offsetEnd){
    //   this.setState({thesauresViewer: {visibility: false, wordList:null}});
    //   return;
    // } // We dont have a full word selected
    // // Extract word from selection
    // let word = selection.toString();
    // //TODO check for multple words and reject
    // word.trim();
  };

  /**
   * Bullet Type Change
   * @param e
   * @param newValue
   */
  bulletTypeChange = (e, newValue) => {
    let bulletTypes = ["EPR", "OPR"];
    this.setState({ tabValue: newValue, bulletType: bulletTypes[newValue] });
  };

  /**
   * Toggle Drawer
   * @param event
   * @param v
   */
  toggleDrawer = (event, v) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({ drawerOpen: v });
  };

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    // IMPORTANT, this is what makes the difference in bullet lengths
    const widthSettings = {
      OPR: "201.050mm",
      EPR: "202.321mm",
    };

    // Header BG Color changes based on which PR being worked
    const bgColor = {
      OPR: "#1a6f46",
      EPR: "",
    };

    const widthSetting = widthSettings[this.state.bulletType];
    const currentBgColor = bgColor[this.state.bulletType];

    return (
      <div id="root" className="root">
        <AppBar
          position="static"
          className="app-bar"
          style={{ backgroundColor: currentBgColor }}
        >
          <Toolbar>
            <Typography variant="h6" color="inherit" className="title">
              Bullet Buddy!
            </Typography>
            <Tabs
              className=""
              value={this.state.tabValue}
              onChange={this.bulletTypeChange}
            >
              <Tab label="EPR/AWD" />
              <Tab label="OPR" />
            </Tabs>
          </Toolbar>
        </AppBar>

        <Container className="content" maxWidth="xl">
          <Grid container justifyContent="space-around" spacing={1}>
            <Grid item xs={12} md={12} lg={12} xl={6} align="center">
              <div className="container">
                <Typography variant="h6">Input Bullets Here</Typography>
                <textarea
                  ref={this.inputTextRef}
                  value={this.state.bulletInputText}
                  rows={6}
                  onChange={(e) => this.handleTextAreaUpdate(e.target.value)}
                  className="bullet-input-text"
                  style={{
                    width: widthSettings[this.state.bulletType],
                    resize: "none",
                    minHeight: "5em",
                  }}
                />
                <div style={{ marginTop: "1em" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      this.handleTextAreaUpdate("");
                      this.inputTextRef.current.style.height = "5em";
                    }}
                  >
                    Clear Input
                  </Button>
                </div>
              </div>

              <div className="container">
                <Typography variant="h6" component="h2">
                  Smart Bullet Editor
                </Typography>

                <Typography variant="subtitle1">
                  Hover over terms to see synonyms
                </Typography>

                <BulletEditor
                  inputBullets={this.state.bulletInputText}
                  updateInputText={this.handleTextAreaUpdate}
                  abbreviationData={this.state.abbreviationTable}
                  width={widthSetting}
                />
              </div>
            </Grid>

            <Grid item xs={12} md={12} lg={12} xl={6} align="center">
              <div className="container">
                <Typography variant="h6" component="h2">
                  Bullet Output
                </Typography>

                <BulletOutputViewer
                  bulletsText={this.state.bulletInputText}
                  width={widthSetting}
                  updateInputText={this.handleTextAreaUpdate}
                />
              </div>

              <div className="container">
                <AcronymViewer
                  width={widthSetting}
                  text={this.state.bulletInputText}
                />
              </div>

              <div className="container">
                <Typography variant="h6">
                  Military Abbreviations Table
                </Typography>

                <Typography variant="subtitle1">
                  Use this to find shortn'd words as well as common
                  ABBR for military terms.<br/>
                  Use <strong>Filters</strong> to search.
                </Typography>

                <AbbreviationTable />

                <Typography variant="subtitle1">
                  <small>
                    Terms from {" "}
                    <a href="https://www.jcs.mil/Portals/36/Documents/Doctrine/pubs/dictionary.pdf" target="_blank">
                      https://www.jcs.mil/Portals/36/Documents/Doctrine/pubs/dictionary.pdf
                    </a><br/>
                    and from AFM 33-336 Tongue and Quill
                  </small>
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Container>

        <div className="bottom-text">
          <p>
            This site utilizes{" "}
            <a href="https://material-ui.com/"> Material-UI</a>,{" "}
            <a href="https://handsontable.com/">HandsOnTable</a>, and the{" "}
            <a href="https://www.datamuse.com/api/">DataMuse API</a> The
            inspiration for this tool came from the{" "}
            <a href="https://ea-pods-team.github.io/pdf-bullets/ ">
              {" "}
              EA-Pods Team pdf-bullets project
            </a>
          </p>
          <p>
            Submit an{" "}
            <a href="https://github.com/AF-Tools/bullet-buddy/issues/new/choose">
              issue
            </a>{" "}
            or view our{" "}
            <a href="https://github.com/AF-Tools/bullet-buddy/">GitHub Page</a>
          </p>
          <p>Maintained by Nicholas Schweikart</p>
        </div>
      </div>
    );
  }
}

export default App;
