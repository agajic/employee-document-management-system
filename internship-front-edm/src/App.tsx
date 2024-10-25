import { Provider} from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './features/login/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import PrivateRoute from './features/login/PrivateRoute';
import SetPasswordPage from './features/login/SetPasswordPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
