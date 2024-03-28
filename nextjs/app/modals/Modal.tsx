"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UseDialog from "@/hooks/useDialog";
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
