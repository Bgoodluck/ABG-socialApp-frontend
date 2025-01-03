import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import Signup from "scenes/signUpPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdvertsComponent from "scenes/widgets/Advertisement/AdvertsComponent";
import AdvertPackage from "scenes/widgets/Advertisement/AdvertPackage";
import StripeVerify from "scenes/widgets/VerifyPayment/StripeVerify";




function App() {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.auth.token));

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!isAuth ? <Signup /> : <Navigate to="/home" />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/adverts" element={<AdvertsComponent />} />
          <Route path="/package" element={<AdvertPackage />} />
          <Route path="/verify-package" element={<StripeVerify/>} />
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
        <ToastContainer />
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;

// function App() {
//   const mode = useSelector((state) => state.auth.mode);
//   const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
//   const isAuth = Boolean(useSelector((state) => state.auth.token));

//   return (
//     <div className="app">
//       <BrowserRouter>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />

//           <Routes>
//             <Route
//               path="/home"
//               element={isAuth ? <HomePage /> : <Navigate to="/login" />}
//             />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route
//               path="/profile/:userId"
//               element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
//             />
//           </Routes>
//         </ThemeProvider>
//       </BrowserRouter>
//       <ToastContainer 
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// }

// export default App;



// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import HomePage from "scenes/homePage";
// import LoginPage from "scenes/loginPage";
// import ProfilePage from "scenes/profilePage";
// import { useMemo } from "react";
// import { useSelector } from "react-redux";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { createTheme } from "@mui/material/styles";
// import { themeSettings } from "theme";
// import Signup from "scenes/signUpPage";
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   const mode = useSelector((state) => state.auth.mode);
//   const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
//   const isAuth = Boolean(useSelector((state) => state.auth.token));

//   return (
//     <BrowserRouter>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <ToastContainer />
//         <Routes>
//           <Route 
//             path="/home" 
//             element={isAuth ? <HomePage /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/login" 
//             element={!isAuth ? <LoginPage /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/signup" 
//             element={!isAuth ? <Signup /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/profile/:userId" 
//             element={isAuth ? <ProfilePage /> : <Navigate to="/login" />} 
//           />
//         </Routes>
//       </ThemeProvider>
//     </BrowserRouter>
//   );
// }

// export default App;