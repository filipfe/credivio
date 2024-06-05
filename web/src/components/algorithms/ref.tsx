import { Button } from "@nextui-org/react";
import Block from "../ui/block";

export default function AlgorithmRef({ title, events }: _Algorithm) {
  return (
    <Block
      title={
        <div>
          <small className="text-font/80">Algorytm</small>
          <h3 className="text-lg">{title}</h3>
        </div>
      }
    >
      <Button color="primary" variant="light">
        Wykonaj
      </Button>
    </Block>
  );
}
