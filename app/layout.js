import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "Event Manager",
  description: "Mini Event Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
