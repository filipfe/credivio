"use client";

import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export async function getSettings(): Promise<Settings> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "telegram_token, telegram_id, ...settings(timezone, currency, language), notifications:settings(telegram:telegram_notifications, email:email_notifications)"
    )
    .returns<Settings>()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useSettings = () => useSWR("settings", () => getSettings());

export async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  const { data: services, error } = await supabase.rpc(
    "get_settings_subscription_services"
  );

  if (error) {
    throw new Error(error.message || "Error");
  }

  return services;
}

async function getLimits(timezone: string, currency: string): Promise<Limit[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_general_limits", {
    p_timezone: timezone,
    p_currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useLimits = (timezone: string, currency: string) =>
  useSWR(["limits", timezone, currency], ([_k, tz, curr]) =>
    getLimits(tz, curr)
  );
