export default function TextBeam({ children }: { children: string }) {
  return (
    <span className="z-10 inline-block relative after:w-full px-2 after:h-full after:absolute after:inset-0 after:from-secondary/80 after:to-secondary/0 after:bg-gradient-to-b after:-z-10 after:rounded-t-md">
      {children}
    </span>
  );
}
