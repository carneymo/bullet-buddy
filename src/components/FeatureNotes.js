import * as React from "react";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";

export default function BasicModal() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  const openFeatureNotes = () => {
    window.open(
      "https://github.com/carneymo/bullet-buddy/releases/tag/v0.3",
      "_blank",
      "noopener,noreferrer"
    );
  };
  const action = (
    <Button color="secondary" size="small" onClick={openFeatureNotes}>
      Feature Notes
    </Button>
  );

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      onClose={handleClose}
      message="Bullet Buddy has been updated to v0.3!"
      action={action}
    />
  );
}
