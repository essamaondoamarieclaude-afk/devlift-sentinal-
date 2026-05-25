import { Outlet } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'
import TopBar from '../ui/TopBar'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-sentinel-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
