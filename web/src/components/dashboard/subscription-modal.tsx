"use client";

import getStripe from "@/utils/stripe/client";
import Stripe from "stripe";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";

const getTitle = (status: Stripe.PaymentIntent.Status) => {
  switch (status) {
    case "succeeded":
      return "Dziękujemy za aktywowanie subskrypcji!";
    case "canceled":
      return "Płatność anulowana";
    case "requires_payment_method":
      return "Wymagana metoda płatności";
    case "requires_confirmation":
      return "Wymagane potwierdzenie";
    default:
      return "";
  }
};

const getDescription = (status: Stripe.PaymentIntent.Status) => {
  switch (status) {
    case "succeeded":
      return "Możesz teraz wygodnie zarządzać swoimi przychodami, wydatkami i celami z jednego miejsca!";
    default:
      return "Płatność nie przebiegła pomyślnie";
  }
};

export default function SubscriptionModal() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] =
    useState<Stripe.PaymentIntent.Status>("processing");
  const searchParams = useSearchParams();

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");
    if (!clientSecret) return;
    (async () => {
      const stripe = await getStripe();
      if (!stripe) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );
      if (!paymentIntent) return;
      setStatus(paymentIntent.status);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Modal isOpen>
      <ModalContent>
        {isLoading ? (
          <div className="flex-1 grid place-content-center">
            <l-hatch size={32} />
          </div>
        ) : (
          <Fragment>
            <ModalHeader>{getTitle(status)}</ModalHeader>
            <ModalBody>
              <p className="text-sm opacity-80">{getDescription(status)}</p>
            </ModalBody>
            <ModalFooter>
              <Link
                href={status === "succeeded" ? "/" : "/settings/subscription"}
              >
                <Button disableRipple color="primary" as="div">
                  {status === "succeeded" ? "Rozpocznij" : "Spróbuj ponownie"}
                </Button>
              </Link>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
