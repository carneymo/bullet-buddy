import * as React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";

// Header BG Color changes based on which PR being worked
const bgColor = {
  OPR: "#1a6f46",
  EPR: "#121212",
};

/**
 * HeaderAppBar
 */
class HeaderAppBar extends React.Component {
  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    const currentBgColor = bgColor[this.props.bulletType];

    return (
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
            value={this.props.tabValue}
            onChange={this.props.bulletTypeChange}
          >
            <Tab style={{ color: "white" }} label="EPR/AWD" />
            <Tab style={{ color: "white" }} label="OPR" />
          </Tabs>
        </Toolbar>
      </AppBar>
    );
  }
}

export default HeaderAppBar;
