import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { IconButton, Tab, Tabs } from "@material-ui/core";
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
import MenuIcon from "@mui/icons-material/Menu";
import Saver from "./components/System/Saver";

/**
 * App
 */
class App extends React.Component {

  storageKey = "bulletBuddyStoredData";

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
      lastSaved: ""
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
    }
    let data = this.getStoredData();
    if (data !== null && data !== "") {
      if(data.bullets) {
        console.log("Saving bullets");
        this.handleTextAreaUpdate(data.bullets);
      }
      if(data.lastSave) {
        console.log("Saving last saved");
        this.setState({lastSave: data.lastSave });
      }
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
   * Get Settings
   * @returns {null|any}
   */
  getStoredData = () => {
    try {
      if (window.localStorage.getItem(this.storageKey)) {
        let data = window.localStorage.getItem(this.storageKey);
        if (data) {
          console.log(data);
          return JSON.parse(data);
        }
      }
    } catch (error) {
      console.log(error);
      return null;
    }
    return null;
  };

  saveData = () => {
    try {
      this.setState({
        "lastSave": Date().toLocaleString()
      });
      window.localStorage.setItem(this.storageKey, JSON.stringify({
        bullets: this.state.bulletInputText,
        lastSave: this.state.lastSave
      }));
    } catch (error) {
      console.log(error);
    }
  }

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
    this.inputTextRef.current.style.height =
      this.inputTextRef.current.scrollHeight + "px";
    this.setState({ bulletInputText: text });
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

            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
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
                    color="secondary"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      this.handleTextAreaUpdate("");
                      this.inputTextRef.current.style.height = "5em";
                    }}
                  >
                    Clear Input
                  </Button>
                  {"  "}
                  <Saver
                    id="SaveBulletsButton"
                    onSave={this.saveData}
                  />
                  <div>
                    <Typography variant="subtitle1">
                      <small>Last Save: { this.state.lastSave }</small>
                    </Typography>
                  </div>
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
                  Use this to find shortn'd words as well as common ABBR for
                  military terms.
                  <br />
                  Use <strong>Filters</strong> to search.
                </Typography>

                <AbbreviationTable />

                <Typography variant="subtitle1">
                  <small>
                    Terms from{" "}
                    <a
                      href="https://www.jcs.mil/Portals/36/Documents/Doctrine/pubs/dictionary.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.jcs.mil/Portals/36/Documents/Doctrine/pubs/dictionary.pdf
                    </a>
                    <br />
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
