"use client";

import UseDialog from "@/hooks/useDialog";
import { Button } from "./ui/button";

export default function AddTodoButton() {
  const { isOpen, onOpen, onClose } = UseDialog();

  function handleOpen() {
    if (!isOpen) {
      onOpen();
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
