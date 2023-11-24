import Navigation from "../ui/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <>
      <Navigation />
      <div>{children}</div>
    </>
  );
}
