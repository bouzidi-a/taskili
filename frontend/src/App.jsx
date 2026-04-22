import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ChooseRole from "./pages/ChooseRole";
import FindTask from "./pages/FindTask";
import TaskDetails from "./pages/TaskDetails";
import ApplyTask from "./pages/ApplyTask";
import LandingPage from "./pages/LandingPage";
import AddTask from "./pages/AddTask";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/tasks" element={<FindTask />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/apply-task/:id" element={<ApplyTask />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;