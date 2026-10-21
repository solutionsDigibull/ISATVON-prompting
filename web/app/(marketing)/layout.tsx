import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DigiBullBadge from "@/components/DigiBullBadge";

// Marketing chrome (nav, footer, DigiBull badge) lives only on the marketing
// route group. The app-host route group ((app)) renders without it so
// app.isatvon.ai shows the prompting interface alone.
export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <DigiBullBadge />
    </>
  );
}
