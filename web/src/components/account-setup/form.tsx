"use client";

import { useEffect, useState, useTransition } from "react";
import Dropdown from "./dropdown";
import CurrencySelect from "../settings/inputs/currency";
import { Dict } from "@/const/dict";
import { CURRENCIES, LOCALE_CURRENCIES } from "@/const";
import { Button, Input, Progress } from "@nextui-org/react";
import UniversalSelect from "../ui/universal-select";
import LanguageSelect from "../settings/inputs/language";
import TimezoneSelect from "../settings/inputs/timezone";
import TelegramBot from "../automation/telegram-bot";
import { useTimezoneSelect } from "react-timezone-select";
import useSWR from "swr";
import { getLanguages } from "@/lib/settings/queries";
import { setupAccount } from "@/lib/auth/actions";
import toast from "@/utils/toast";

export default function AccountSetupForm({
  dict,
  settings,
}: {
  dict: Dict["private"];
  settings: Settings;
}) {
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState(settings.first_name || "");
  const [lastName, setLastName] = useState(settings.last_name || "");
  const [submitAvailable, setSubmitAvailable] = useState(false);
  const [timezone, setTimezone] = useState(deviceTimezone);
  const [language, setLanguage] = useState(settings.language);
  const { options, parseTimezone } = useTimezoneSelect({});
  const [currency, setCurrency] = useState(
    LOCALE_CURRENCIES[settings.language]
  );
  const [step, setStep] = useState(
    settings.first_name && settings.last_name ? 1 : 0
  );
  const { isLoading, data: languages } = useSWR("languages", () =>
    getLanguages()
  );
  const isDisabled =
    (step === 0 && (!firstName || !lastName)) ||
    (step === 1 && !currency) ||
    (step === 2 && (!language || !timezone));

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await setupAccount(formData);
      console.log(res.error);
      if (res?.error) {
        toast({
          type: "error",
          message: "Wystąpił błąd, spróbuj ponownie!",
        });
      }
    });

  useEffect(() => {
    setSubmitAvailable(step > 1);
  }, [step]);

  return (
    <>
      <div className="flex items-end gap-4 justify-between px-6 sm:px-0">
        <div className="grid gap-1">
          <h1 className="font-bold text-xl sm:text-2xl">
            Cześć, {settings.first_name}
          </h1>
          <p className="text-font/80 text-sm">
            Ustaw swoje konto zanim rozpoczniesz
          </p>
        </div>
        <div className="max-w-32 w-full mb-1">
          <Progress
            size="sm"
            value={step + 1}
            label="Krok"
            maxValue={4}
            classNames={{
              label: "text-xs text-font/60",
              value: "text-xs font-medium",
            }}
            showValueLabel
            valueLabel={`${step + 1} / 4`}
          />
        </div>
      </div>
      <form action={action}>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2 sm:gap-3">
            <Dropdown
              title="Dane"
              step={step}
              onOpen={() => setStep(0)}
              index={0}
            >
              <Input
                classNames={{ inputWrapper: "!bg-light shadow-none border" }}
                name="first_name"
                label={
                  dict.settings.account["personal-data"].form["first-name"]
                    .label
                }
                placeholder={
                  dict.settings.account["personal-data"].form["first-name"]
                    .label
                }
                value={firstName}
                onValueChange={(value) => setFirstName(value)}
                className="max-w-xl"
              />
              <Input
                classNames={{ inputWrapper: "!bg-light shadow-none border" }}
                label={
                  dict.settings.account["personal-data"].form["last-name"].label
                }
                name="last_name"
                placeholder={
                  dict.settings.account["personal-data"].form["last-name"].label
                }
                value={lastName}
                onValueChange={(value) => setLastName(value)}
                className="max-w-xl"
              />
            </Dropdown>
            <Dropdown
              title="Domyślna waluta"
              step={step}
              disabled={!firstName || !lastName}
              onOpen={() => setStep(1)}
              index={1}
            >
              <UniversalSelect
                name="currency"
                aria-label="Currency select"
                selectedKeys={[currency]}
                elements={CURRENCIES}
                required
                isRequired
                onChange={(e) => setCurrency(e.target.value)}
              />
            </Dropdown>
            <Dropdown
              title="Lokalizacja"
              disabled={!currency}
              step={step}
              index={2}
              onOpen={() => setStep(2)}
            >
              <UniversalSelect
                name="language"
                aria-label="Language select"
                label={dict.settings.preferences.location.language.label}
                selectedKeys={[language]}
                isLoading={isLoading}
                isDisabled={isLoading}
                elements={
                  languages
                    ? languages.map((lang) => ({
                        name: lang.name,
                        value: lang.code,
                      }))
                    : []
                }
                placeholder={
                  dict.settings.preferences.location.language.placeholder
                }
                onChange={(e) => setLanguage(e.target.value as Locale)}
              />
              <UniversalSelect
                label={dict.settings.preferences.location.timezone.label}
                selectedKeys={timezone ? [parseTimezone(timezone).value] : []}
                elements={options as Option<string>[]}
                onChange={(e) =>
                  setTimezone(
                    parseTimezone(e.target.value).value ===
                      parseTimezone(deviceTimezone).value
                      ? deviceTimezone
                      : e.target.value
                  )
                }
              />
              <input type="hidden" name="timezone" value={timezone} />
            </Dropdown>
            <Dropdown
              title="Telegram Bot (opcjonalnie)"
              step={step}
              disabled={!currency || !language || !timezone}
              index={3}
              onOpen={() => setStep(3)}
            >
              <TelegramBot
                simplified
                settings={settings}
                dict={dict.automation}
              />
            </Dropdown>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 sm:px-0">
            <Button
              className="font-medium bg-white border disabled:opacity-60"
              disableRipple
              isDisabled={step === 0}
              disabled={step === 0}
              onPress={() => setStep((prev) => prev - 1)}
            >
              Wstecz
            </Button>
            <Button
              isDisabled={isDisabled || isPending}
              disabled={isDisabled || isPending}
              isLoading={isPending}
              color="primary"
              className="font-medium disabled:opacity-60"
              disableRipple
              type={submitAvailable ? "submit" : "button"}
              onPress={() => step < 2 && setStep((prev) => prev + 1)}
            >
              {step < 2 ? "Dalej" : "Rozpocznij"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
