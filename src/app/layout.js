import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../../components/Toast";
import { BalanceProvider } from "../../components/BalanceContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "SwiftBill - Pay Fast. Live Easy",
  description:
    "SwiftBill lets you top up internet bundles and pay electricity bills fast and securely.",
  keywords: [
    "SwiftBill",
    "pay bills",
    "buy data",
    "electricity",
    "Ghana",
    "internet top up",
    "MTN",
    "ECG",
  ],
  authors: [{ name: "SwiftBill Team" }],
  icons: {
    icon: "../public/assets/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://swiftbill.com",
    title: "SwiftBill - Fast Internet & Electricity Payments",
    description: "Top up data and pay utility bills in seconds with SwiftBill.",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "SwiftBill social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftBill - Fast Internet & Electricity Payments",
    description: "Top up data and pay utility bills in seconds with SwiftBill.",
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <BalanceProvider>
          <ToastProvider>{children}</ToastProvider>
        </BalanceProvider>
      </body>
    </html>
  );
}
