import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './features/pieces/DashBoardPage'
import NewPiecePage from './features/pieces/NewPiecePage'
import PieceDetailPage from './features/pieces/PieceDetailPage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes nested inside Layout are drawn inside its <Outlet />. */}
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="new" element={<NewPiecePage />} />
          <Route path="pieces/:id" element={<PieceDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}