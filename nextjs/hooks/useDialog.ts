import { ModalType, TodoType } from "@/lib/type";
import { create } from "zustand";

interface UseDialogProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type: ModalType;
  setType: (type: ModalType) => void;
  todo?: TodoType | null;
  setTodo: (todo: TodoType | null) => void;
}

const useDialog = create<UseDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: ModalType.Add,
  setType: (type) => set({ type }),
  todo: null,
  setTodo: (todo: TodoType | null) => {
    return set({ todo: todo });
  },
}));

export default useDialog;
