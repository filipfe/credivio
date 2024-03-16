import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="w-full h-full grid place-content-center">
      <Spinner />
    </div>
  );
}
