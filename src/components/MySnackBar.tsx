import Snackbar from "@mui/material/Snackbar";
import { Fade } from "@mui/material";
import { useState } from "react";

function MySnackbar({state,setstate,message}: any) {
  const [open, setOpen] = useState(state);    

  const handleClose = (event:any, reason:any) => {
    // this condition will prevent dissapering Snackbar when clicking away
    if (reason === 'clickaway') {
      return; 
    }

    setOpen(false);

    setstate(false);
  };    

  return (               
    <Snackbar 
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      open={open} 
      onClose={handleClose} 
      autoHideDuration={1750}
      message={message}
      TransitionComponent={Fade}      
      ContentProps={{
        sx:{
          display: 'block',
          minWidth: '250px',
          backgroundColor: 'rgb(90, 210, 216)',
          color: 'black',
          fontWeight: 'bolder',
          fontSize: '17px',
          zIndex: '2',
          textAlign: 'center',
          borderRadius: '16px',
          padding: '16px',          
        }
      }}
    />    
  );
};
  
export default MySnackbar;