"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalType } from "@/lib/type";
import React from "react";

interface AddTodoModalInterface {
  title: string;
  description: string;
  isOpen: boolean;
  onChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function Modal({
  children,
  description,
  isOpen,
  onChange,
  title,
}: AddTodoModalInterface) {
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
