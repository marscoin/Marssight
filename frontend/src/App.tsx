import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { Home } from '@/pages/Home'
import { Block } from '@/pages/Block'
import { Transaction } from '@/pages/Transaction'
import { Address } from '@/pages/Address'
import { Status } from '@/pages/Status'
import { Markets } from '@/pages/Markets'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="block/:hashOrHeight" element={<Block />} />
            <Route path="tx/:txid" element={<Transaction />} />
            <Route path="address/:address" element={<Address />} />
            <Route path="blocks" element={<Home />} />
            <Route path="markets" element={<Markets />} />
            <Route path="status" element={<Status />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
