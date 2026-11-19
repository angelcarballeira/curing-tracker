import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './features/pieces/DashBoardPage'
import NewPiecePage from './features/pieces/NewPiecePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes nested inside Layout are drawn inside its <Outlet />. */}
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="new" element={<NewPiecePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}