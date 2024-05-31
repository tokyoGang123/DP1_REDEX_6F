import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { TextField } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RedEX",
  description: "Simulación y ejecución de asignación de paquetes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

