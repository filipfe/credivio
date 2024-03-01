import { Fragment } from "react";

export default function Header() {
  return (
    <Fragment>
      <header className="h-20 sticky top-0 bg-white z-50"></header>
      <header className="flex items-center gap-4 justify-between px-4 h-20 sticky top-0 bg-white z-50"></header>
    </Fragment>
  );
}
