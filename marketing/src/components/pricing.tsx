const benefits = [
  "Nielimitowane przychody i wydatki",
  "Statystyki okresowe",
  "Integracja bota Telegram",
  "Zarządzanie celami",
  "Płatności cykliczne",
];

export default function Pricing() {
  return (
    <section className="py-8 sm:py-12 pt-16 sm:pt-24 bg-white">
      <div className="w-full max-w-7xl px-6 mx-auto">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className=" text-primary font-mono font-medium tracking-wider uppercase">
            Cennik
          </h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            Odblokuj wolność finansową
          </h3>
        </div>
        <div className="mx-auto my-12 max-w-4xl">
          <div className="rounded-md border bg-light p-6 grid gap-4">
            <h3 className="font-black">Subskrypcja Credivio</h3>
            <div className="grid grid-cols-2 gap-3">
              <label
                htmlFor=""
                className="border rounded-md bg-white py-4"
              ></label>
              <label
                htmlFor=""
                className="border rounded-md bg-white py-4"
              ></label>
            </div>
            <ul className="grid gap-3 my-3">
              {benefits.map((benefit) => (
                <li className="text-sm text-font/80" key={benefit}>
                  {benefit}
                </li>
              ))}
            </ul>
            <button className="text-white py-2.5 px-5 text-sm font-medium rounded-md bg-primary">
              Rozpocznij 7-dniowy okres próbny
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
