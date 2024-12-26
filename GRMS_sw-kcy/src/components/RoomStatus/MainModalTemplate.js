import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box } from '@mui/material';
import AddHomeIcon from '@mui/icons-material/AddHome';

const MainModalTemplate = () => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);

  const openMainModal = () => setIsMainModalOpen(true);
  const closeMainModal = () => setIsMainModalOpen(false);

  const openSmallModal = () => {
    setIsSmallModalOpen(true);
  };

  const closeSmallModal = () => setIsSmallModalOpen(false);

  return (
    <div>
        <Box position="relative" display="inline-block" m={5}>
            <Button variant="contained" style={{ width: 200, height: 200 }} onClick={openMainModal}>
                <AddHomeIcon style={{ fontSize: 50 }} />
                <AddHomeIcon style={{ fontSize: 50 }} />
            </Button>

            <Stack 
                direction="row" 
                spacing={0.5} 
                justifyContent="center" 
                style={{ 
                position: 'absolute', 
                top: "0%", 
                left: "0%", 
                backgroundColor: 'white', 
                padding: '2px', 
                borderRadius: '8px' 
                }}
            >
                A100 
            </Stack>

            <Stack 
                direction="row" 
                spacing={0.5} 
                justifyContent="center" 
                style={{ 
                position: 'absolute', 
                top: "-10%", 
                right: "-20%", 
                backgroundColor: 'red', 
                padding: '2px', 
                borderRadius: '8px' 
                }}
            >
                <Button variant="contained" style={{ width: 50, height: 50 }} onClick={openSmallModal}>
                Btn 1
                </Button>
                <Button variant="contained" style={{ width: 50, height: 50 }} onClick={openSmallModal}>
                Btn 2
                </Button>
            </Stack>

            <Stack 
                direction="row" 
                spacing={0.5} 
                justifyContent="center" 
                style={{ 
                position: 'absolute', 
                bottom: "-5%", 
                right: "-10%", 
                backgroundColor: 'red', 
                padding: '2px', 
                borderRadius: '8px' 
                }}
            >
                <Button variant="contained" style={{ minWidth:40, width: 40, height: 40 }} onClick={openSmallModal}>
                Btn 1
                </Button>
                <Button variant="contained" style={{ minWidth:40, width: 40, height: 40 }} onClick={openSmallModal}>
                Btn 2
                </Button>
                <Button variant="contained" style={{ minWidth:40, width: 40, height: 40 }} onClick={openSmallModal}>
                Btn 3
                </Button>
            </Stack>
        </Box>

      <Dialog open={isMainModalOpen} onClose={closeMainModal}>
        <DialogTitle>Main Modal</DialogTitle>
        <DialogContent>
          <p>This is the main modal content.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMainModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isSmallModalOpen} onClose={closeSmallModal}
      >
        <DialogTitle>Small Modal</DialogTitle>
        <DialogContent>
          <p>This is the small modal content.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSmallModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainModalTemplate;