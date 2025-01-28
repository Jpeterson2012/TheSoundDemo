import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";

function MySnackbar({state,setstate,message}: any){
    const [open, setOpen] = useState(state);    
  
    const handleClose = (event:any, reason:any) => {
     // this condition will prevent dissapering Snackbar when clicking away
      if (reason === 'clickaway') {
        return; 
      }
  
      setOpen(false);
      setstate(false)
    };    
  
    return (
      <div>           
        <Snackbar 
        anchorOrigin={{vertical: 'bottom',horizontal: 'center'}}
         open={open} 
         onClose={handleClose} 
         autoHideDuration={2000}
         message={message}
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
                marginBottom: '38px',
            }
         }}
        />
      </div>
    );
  };
  
export default MySnackbar