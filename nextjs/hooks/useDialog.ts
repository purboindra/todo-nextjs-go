import { ModalType, TodoType } from "@/lib/type";
import { create } from "zustand";

interface UseDialogProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  type: ModalType;
  setType: (type: ModalType) => void;
  todo?: TodoType;
  setTodo: (todo: TodoType) => void;
}

const useDialog = create<UseDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  type: ModalType.Add,
  setType: (type) => set({ type }),
  todo: undefined,
  setTodo: (todo: TodoType) => set({ todo: todo }),
}));

export default useDialog;
