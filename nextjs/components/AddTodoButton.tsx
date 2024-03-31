"use client";

import UseDialog from "@/hooks/useDialog";
import { Button } from "./ui/button";
import { ModalType } from "@/lib/type";

export default function AddTodoButton() {
  const { isOpen, onOpen, setType } = UseDialog();

  function handleOpen() {
    if (!isOpen) {
      onOpen();
      setType(ModalType.Add);
    }
  }

  return (
    <>
      <Button onClick={handleOpen} className="flex">
        Add Todo
      </Button>
    </>
  );
}
