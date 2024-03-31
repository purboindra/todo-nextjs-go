"use client";

import AddTodoModal from "@/app/modals/AddTodoModal";
import EditTodoModal from "@/app/modals/EditTodoModal";
import UseDialog from "@/hooks/useDialog";
import { ModalType } from "@/lib/type";

const ModalProvider = () => {
  const { type } = UseDialog();
  return <>{type === ModalType.Add ? <AddTodoModal /> : <EditTodoModal />}</>;
};

export default ModalProvider;
