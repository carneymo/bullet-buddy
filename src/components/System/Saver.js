import React from "react";
import Button from "@mui/material/Button";
import { Save } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Saver
 */
class Saver extends React.Component {

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      bullets: props.bullets,
      tab: props.tab,
      open: false,
      disabled: false
    };
    this.setOpen = this.setOpen.bind(this);
  }

  /**
   * Set Open
   * @param openState
   */
  setOpen(openState) {
    this.setState({open: openState});
  }

  /**
   * Handle Close
   * @param event
   * @param reason
   */
  handleClose = (event, reason) => {
    if(reason === 'clickaway') {
      return;
    }
    this.setOpen(false);
  }

  /**
   * Render
   * @returns {JSX.Element}
   */
  render() {
    return (
      <span>
        <Button
          disabled={this.props.disabled}
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<Save />}
          onClick={() => {
            this.props.onSave();
            this.setOpen(true);
          }}
        >
          Save
        </Button>
        <Snackbar
          open={this.state.open}
          autoHideDuration={4000}
          onClose={this.handleClose}
          action={this.action}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity="success">Saved bullets!</Alert>
        </Snackbar>
      </span>
    );
  }
}

export default Saver;