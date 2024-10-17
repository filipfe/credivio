import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import {
  MoreVerticalIcon,
  MousePointerSquareIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { Fragment, Key, useState } from "react";
import EditModal from "./modals/edit-modal";
import DeleteModal from "./modals/delete-modal";
import { Dict } from "@/const/dict";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"];
  operation: Operation;
  // onSelect?: () => void;
  onEdit?: (updated: Operation) => void;
  onDelete?: (id: string) => void;
  type: OperationType;
};

export default function ActionsDropdown({
  dict,
  operation,
  type,
  onEdit,
  // onSelect,
  onDelete,
}: Props) {
  const { isOpen, onClose, onOpenChange } = useDisclosure();
  const disclosure = useDisclosure();
  const [edited, setEdited] = useState<Operation | null>(null);
  const [deleted, setDeleted] = useState<Operation | null>(null);

  const onAction = (key: Key) => {
    switch (key) {
      // case "select":
      //   onSelect && onSelect();
      //   return;
      case "edit":
        setEdited(operation);
        onClose();
        disclosure.onOpen();
        return;
      case "delete":
        onDelete ? onDelete(operation.id) : setDeleted(operation);
        onClose();
        return;
      default:
        return;
    }
  };

  return (
    <Fragment>
      <Dropdown
        shadow="sm"
        placement="left"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DropdownTrigger>
          <button className="h-6 w-6 -my-2 rounded-full grid place-content-center">
            <MoreVerticalIcon size={20} />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={[]}
          variant="faded"
          aria-label="Dropdown menu with description"
          onAction={onAction}
        >
          {/* <DropdownItem
            key="select"
            description="Zaznacz operację"
            startContent={<MousePointerSquareIcon size={16} />}
          >
            Zaznacz
          </DropdownItem> */}
          <DropdownItem
            key="edit"
            description={dict.menu.edit.description}
            startContent={<SquarePenIcon size={16} />}
            closeOnSelect={false}
            showDivider
          >
            {dict.menu.edit.title}
          </DropdownItem>
          <DropdownItem
            closeOnSelect={false}
            key="delete"
            className="text-danger"
            color="danger"
            description={dict.menu.delete.description}
            startContent={<Trash2Icon className="text-danger" size={16} />}
          >
            {dict.menu.delete.title}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <EditModal
        dict={dict.modal.edit}
        edited={edited}
        setEdited={setEdited}
        type={type}
        onEdit={onEdit}
        {...disclosure}
      />
      {!onDelete && (
        <DeleteModal
          dict={dict.modal.delete}
          type={type}
          deleted={deleted ? [deleted] : []}
          onClose={() => setDeleted(null)}
        />
      )}
    </Fragment>
  );
}
