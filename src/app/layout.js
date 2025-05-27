'use client'
import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import { CarrinhoProvider } from "../context/CarrinhoContext"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <CarrinhoProvider>
            {children}
            <Toaster />
          </CarrinhoProvider>
        </Provider>
      </body>
    </html>
  )
}