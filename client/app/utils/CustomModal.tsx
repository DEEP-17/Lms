import { Box, Modal } from "@mui/material";
import React from 'react';
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: unknown;
  component: any;
  setRoute?: (route: string) => void;
}

const CustomModal: React.FC<Props> = ({ open, setOpen, setRoute, component: Component }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[52%] left-[50%] -translate-y-1/2 w-[520px] h-[620px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-8 outline-name justify-center items-center">
        <Component setOpen={setOpen} setRoute={setRoute} />
      </Box>
    </Modal>
  )
}

export default CustomModal