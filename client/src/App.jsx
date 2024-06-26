import './App.css'
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import SingleChat from './pages/singleChat.jsx';
import LandingPage from './pages/landingPage.jsx';
import AdminDashboard from './pages/adminDashboard.jsx';
import AdminChatPanel from './pages/adminChatPanel.jsx';
import LoginPage from './pages/loginPage.jsx';
import ClientForm from './pages/clientForm.jsx';
function App() {
  return (
    <Router>
    <>
      <div className='app'>
        <Routes>
          <Route path='/' exact Component={LandingPage}/>
          <Route path='/clientLogin' exact Component={ClientForm}/>
          <Route path='/login' exact Component={LoginPage}/>
          <Route   path='/singleChat' exact  Component={SingleChat}  />
          <Route   path='/dashboard' exact  Component={AdminDashboard}  />
          <Route path='/adminChatPanel/:roomId' exact Component={AdminChatPanel}/>
          
        </Routes>
      </div>
    </>
    </Router>
  )
}

export default App
