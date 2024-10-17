"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Toast from "../../ui/toast";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { Dict } from "@/const/dict";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["modal"];
  docPath: string | null;
  setDocPath: Dispatch<SetStateAction<string | null>>;
};

export default function DocModal({ docPath, setDocPath }: Props) {
  const { onClose, onOpenChange } = useDisclosure();
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState({
    url: true,
    image: true,
  });

  useEffect(() => {
    setMediaUrl("");
    if (!docPath) return;
    setIsLoading({ url: true, image: true });
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.storage
        .from("docs")
        .createSignedUrl(docPath, 60);
      if (data) {
        setMediaUrl(data.signedUrl);
        setIsLoading((prev) => ({ ...prev, url: false }));
      } else {
        toast.custom((t) => (
          <Toast {...t} message="Nie udało się wczytać obrazu!" type="error" />
        ));
        onClose();
        setDocPath(null);
      }
    })();
  }, [docPath]);

  return (
    <Modal
      isOpen={!!docPath}
      onOpenChange={onOpenChange}
      onClose={() => setDocPath(null)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {mediaUrl && (
                <Link href={`${mediaUrl}&download`}>
                  <Button as="div" disableRipple type="submit">
                    <DownloadIcon size={16} /> Pobierz
                  </Button>
                </Link>
              )}
            </ModalHeader>
            <ModalBody className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40">
              {isLoading.url || (isLoading.image && <l-hatch size={32} />)}
              {!isLoading.url && (
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  onLoad={() =>
                    setIsLoading((prev) => ({ ...prev, image: false }))
                  }
                  className={cn(
                    "w-full h-auto rounded-md max-h-[80vh]",
                    isLoading.image && "sr-only"
                  )}
                  src={mediaUrl}
                  alt=""
                />
              )}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
