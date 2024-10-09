const benefits = [
  "Nielimitowane przychody i wydatki",
  "Statystyki okresowe",
  "Integracja bota Telegram",
  "Zarządzanie celami",
  "Płatności cykliczne",
];

export default function Pricing() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="flex flex-col gap-8 sm:items-center sm:grid grid-cols-2 w-full max-w-7xl px-6 mx-auto">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl">
            Odblokuj wolność finansową
          </h2>
          <p className="text-sm text-font/60 leading-relaxed">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione
            aut fuga alias unde architecto exercitationem reiciendis
            consequuntur animi in ipsum magnam iste, deleniti optio doloribus
            suscipit iure, nisi voluptas porro!
          </p>
        </div>
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
    </section>
  );
}
