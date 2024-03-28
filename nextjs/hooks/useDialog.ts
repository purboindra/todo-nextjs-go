import { create } from "zustand";

interface UseDialogProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const UseDialog = create<UseDialogProps>()((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ isOpen: true })),
  onClose: () => set((state) => ({ isOpen: false })),
}));

export default UseDialog;
