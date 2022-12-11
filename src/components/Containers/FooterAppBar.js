import * as React from "react";
import { AppBar, Typography, Container } from "@mui/material";

/**
 * FooterAppBar
 */
class FooterAppBar extends React.Component {
  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    return (
      <AppBar position="static" color="primary" className="footer-bar">
        <Container maxWidth="md">
          <Typography
            variant="body1"
            color="inherit"
            style={{ textAlign: "center" }}
          >
            Modified by Ryan Carney-Mogan. | Submit an{" "}
            <a
              href="https://github.com/carneymo/bullet-buddy/issues/new/choose"
              target="_blank"
              rel="noreferrer noopener"
            >
              issue
            </a>{" "}
            or view the{" "}
            <a
              href="https://github.com/carneymo/bullet-buddy/"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub Page
            </a>
            <br />
            Original Utility by{" "}
            <a
              href="https://github.com/AF-Tools/bullet-buddy/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Nicholas Schweikart
            </a>
          </Typography>
        </Container>
      </AppBar>
    );
  }
}

export default FooterAppBar;
