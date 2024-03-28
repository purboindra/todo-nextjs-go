import UseDialog from "@/hooks/useDialog";
import Modal from "./Modal";

export default function AddTodoModal() {
  const { isOpen, onOpen, onClose } = UseDialog();

  const handleOpen = () => {
    if (!isOpen) {
      onOpen();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onChange={handleOpen}
      title="Add Todo"
      description="Add a new todo"
    >
      <h1>Hello</h1>
    </Modal>
  );
}
