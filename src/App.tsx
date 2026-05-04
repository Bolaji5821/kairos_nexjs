import { Route, Routes } from "react-router";
import AuthLayout from "./components/AuthLayout.tsx";
import DashboardLayout from "./components/DashboardLayout.tsx";
import Competitions from "./features/Competitions";
import Dashboard from "./features/Dashboard";
import Jobs from "./features/Jobs";
import Login from "./features/Login";
import Onboarding from "./features/Onboarding";
import Settings from "./features/Settings";
import ForgotPassword from "./features/ForgotPassword/index.tsx";
import ResetPassword from "./features/ResetPassword/index.tsx";
import JobApplicants from "./features/Jobs/components/JobApplicants.tsx";
import PostNewJob from "./features/Jobs/components/PostJob/PostNewJob.tsx";
import PostNewCompetition from "./features/Competitions/components/PostNewCompetition.tsx";
import TalentPool from "./features/Jobs/components/TalentPool.tsx";
import TalentDetailsPage from "./features/Jobs/components/TalentDetailsPage.tsx";
import ViewCompetition from "./features/Competitions/components/ViewCompetition.tsx";
import ViewJobPage from "./features/Jobs/components/ViewJobPage.tsx";
import GetVerified from "./components/GetVerified.tsx";

function App() {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="jobs">
          <Route index element={<Jobs />} />
          <Route path=":id" element={<ViewJobPage />} />
          <Route path="new" element={<PostNewJob />} />
          <Route path=":id/applicants" element={<JobApplicants />} />
          <Route path="talent-pool">
            <Route index element={<TalentPool />} />
            <Route path=":userId" element={<TalentDetailsPage />} />
          </Route>
        </Route>
        <Route path="competitions">
          <Route index element={<Competitions />} />
          <Route path=":competitionId" element={<ViewCompetition />} />
          <Route path="new" element={<PostNewCompetition />} />
        </Route>
        <Route path="settings" element={<Settings />} />
        <Route path="verify" element={<GetVerified />} />
        <Route path="*" element={<></>} />
      </Route>
    </Routes>
  );
}

export default App;
