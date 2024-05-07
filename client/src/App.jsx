import './App.css'
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import SingleChat from './components/singleChat.jsx';
import LandingPage from './components/landingPage.jsx';
import AdminDashboard from './components/adminDashboard.jsx';
function App() {
  return (
    <Router>
    <>
      <div className='app'>
        <Routes>
          <Route path='/' exact Component={LandingPage}/>
          <Route   path='/singleChat' exact  Component={SingleChat}  />
          <Route   path='/dashboard' exact  Component={AdminDashboard}  />
        </Routes>
      </div>
    </>
    </Router>
  )
}

export default App
