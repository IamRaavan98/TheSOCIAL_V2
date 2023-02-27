import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import UserContext from "./context/UserContext";

function App() {
  return (
    <Router>
      
     <UserContext>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
     </UserContext>
    
    </Router>
  );
}

export default App;
