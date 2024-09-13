import { format } from "date-fns";

interface OperationWithPartialId extends Omit<Operation, "id"> {
  id?: string;
}

export default function formDataToOperation(
  formData: FormData,
  id?: string,
): OperationWithPartialId {
  const operation: OperationWithPartialId = {
    id,
    title: formData.get("title")?.toString() || "",
    amount: formData.get("amount")?.toString() || "",
    issued_at: formData.get("issued_at")?.toString() ||
      format(new Date(), "yyyy-MM-dd"),
    currency: formData.get("currency")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    label: formData.get("label")?.toString(),
    doc_path: "",
  };

  return operation;
}
