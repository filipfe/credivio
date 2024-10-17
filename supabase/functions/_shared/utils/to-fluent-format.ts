import { Dict } from "../locales/index.ts";

export default function toFluentFormat(
  obj: Dict,
): string {
  return Object.entries(obj).map(([key, value]) =>
    `${key} = ` + (typeof value === "string" ? value : "\n" +
      Object.entries(value).map(([key, value]) => `.${key} = ${value}`).join(
        "\n",
      ))
  ).join("\n");
}
