"use client";

import Block from "@/components/ui/block";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import CurrencySelect from "@/components/ui/table/currency-select";
import { getExchangeRate } from "@/lib/currencies/queries";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { RepeatIcon } from "lucide-react";
import useSWR from "swr";

export default function Page() {
  const { data } = useSWR(["exchange_rate", "PLN", "USD"], ([_k, from, to]) =>
    getExchangeRate(from, to)
  );
  console.log(data);
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6">
      <HorizontalScroll fullWidth>
        <></>
      </HorizontalScroll>
      <div className="flex flex-col flex-1 gap-4 sm:gap-6 xl:grid grid-cols-3">
        <div className="grid grid-cols-2 items-center col-span-2 gap-4 sm:gap-6 relative">
          <Block className="flex-1">
            <CurrencySelect
              value="PLN"
              size="md"
              onChange={() => {}}
              disallowAll
            />
            <Input label="Suma" defaultValue="1" />
          </Block>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 border rounded-full h-16 w-16 bg-white grid place-content-center">
            <RepeatIcon size={24} className="rotate-90 xl:rotate-0" />
          </div>
          <Block className="flex-1">
            <Select label="Waluta" disallowEmptySelection>
              <SelectItem value="PLN" key="PLN">
                PLN
              </SelectItem>
              <SelectItem value="USD" key="USD">
                USD
              </SelectItem>
            </Select>
            <Input label="Suma" defaultValue="1" />
          </Block>
        </div>
        <Block title="Ostatnie wymiany">
          <></>
        </Block>
      </div>
    </div>
  );
}
