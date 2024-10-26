// app/layout.js
import "./globals.css";
import { AuthProvider } from "./authContext"; // Ensure correct relative path

export const metadata = {
  title: "Your App",
  description: "An amazing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
