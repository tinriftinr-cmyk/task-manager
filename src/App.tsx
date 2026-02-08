import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';

import { ProjectPage } from './pages/ProjectPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { TrashPage } from './pages/TrashPage';
import { ThemeProvider } from './contexts/ThemeContext';

import { SmartListPage } from './pages/SmartListPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SmartListPage title="インボックス" filterType="inbox" />} />
            <Route path="today" element={<SmartListPage title="今日" filterType="today" />} />
            <Route path="upcoming" element={<SmartListPage title="今後" filterType="upcoming" />} />
            <Route path="overdue" element={<SmartListPage title="期限切れ" filterType="overdue" />} />
            <Route path="tag/:tagId" element={<ProjectPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="trash" element={<TrashPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
