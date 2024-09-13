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

type Props = {
  operation: Operation | null;
  onSelect: () => void;
  onEdit?: (updated: Operation) => void;
  onDelete?: (id: string) => void;
  type: OperationType;
};

export default function ActionsDropdown({
  operation,
  type,
  onEdit,
  onSelect,
  onDelete,
}: Props) {
  const disclosure = useDisclosure();
  const [edited, setEdited] = useState<Operation | null>(null);
  const [deleted, setDeleted] = useState<Operation | null>(null);

  const onAction = (key: Key) => {
    switch (key) {
      case "select":
        onSelect();
        return;
      case "edit":
        setEdited(operation);
        disclosure.onOpen();
        return;
      case "delete":
        setDeleted(operation);
        return;
      default:
        return;
    }
  };

  return (
    <Fragment>
      <Dropdown shadow="sm" placement="left">
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
          <DropdownItem
            key="select"
            description="Zaznacz operację"
            startContent={<MousePointerSquareIcon size={16} />}
          >
            Zaznacz
          </DropdownItem>
          <DropdownItem
            key="edit"
            description="Modyfikuj operację"
            startContent={<SquarePenIcon size={16} />}
            closeOnSelect={false}
            showDivider
          >
            Edytuj
          </DropdownItem>
          <DropdownItem
            closeOnSelect={false}
            key="delete"
            className="text-danger"
            color="danger"
            description="Usuń operację"
            startContent={<Trash2Icon className="text-danger" size={16} />}
          >
            Usuń
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <EditModal
        edited={edited}
        setEdited={setEdited}
        type={type}
        onEdit={onEdit}
        {...disclosure}
      />
      {!onDelete && (
        <DeleteModal
          type={type}
          deleted={deleted ? [deleted] : []}
          onClose={() => setDeleted(null)}
        />
      )}
    </Fragment>
  );
}
