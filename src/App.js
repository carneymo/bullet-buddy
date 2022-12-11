import React from "react";
import Typography from "@mui/material/Typography";
import "./styles/css/App.css";
import "./components/RawBulletTextArea";
import BulletEditor from "./components/Bullets/BulletEditor";
import BulletOutputViewer from "./components/Bullets/BulletOutputViewer";
import AcronymViewer from "./components/AcronymViewer";
import AbbreviationTable from "./components/Abbreviations/AbbreviationTable";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Saver from "./components/System/Saver";
import NavBar from "./components/Containers/HeaderAppBar";
import FooterAppBar from "./components/Containers/FooterAppBar";

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
      lastSaved: "",
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
      if (data.bullets) {
        this.handleTextAreaUpdate(data.bullets);
      }
      if (data.lastSave) {
        this.setState({ lastSave: data.lastSave });
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
   * Get Stored Data
   * @returns {null|any}
   */
  getStoredData = () => {
    try {
      if (window.localStorage.getItem(this.storageKey)) {
        let data = window.localStorage.getItem(this.storageKey);
        if (data) {
          return JSON.parse(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  /**
   * Save Data
   */
  saveData = () => {
    try {
      this.setState({
        lastSave: Date().toLocaleString(),
      });
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          bullets: this.state.bulletInputText,
          lastSave: this.state.lastSave,
        })
      );
    } catch (error) {
      console.log(error);
    }
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
      //12 pt font widths
      //OPR: "201.050mm",
      //EPR: "202.321mm",

      //10 pt font widths
      OPR: "167.542mm",
      EPR: "168.100mm",
    };

    const widthSetting = widthSettings[this.state.bulletType];

    return (
      <div id="root" className="root">
        <NavBar
          tabValue={this.state.tabValue}
          bulletType={this.state.bulletType}
          bulletTypeChange={this.bulletTypeChange}
        />

        <Container className="content" maxWidth="{false}">
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
                  <Saver id="SaveBulletsButton" onSave={this.saveData} />
                  <div>
                    <Typography variant="subtitle1">
                      <small>Last Save: {this.state.lastSave}</small>
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
        <FooterAppBar />
      </div>
    );
  }
}

export default App;
