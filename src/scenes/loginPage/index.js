import React, { useEffect, useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../../asset/signin.gif";
import { summaryApi } from "../../common";
import { toast } from "react-toastify";
import { Box, useTheme, Typography, useMediaQuery, IconButton } from "@mui/material";
import { useDispatch } from 'react-redux';
import { setLogin, setMode } from 'store/userSlice';
import { DarkMode, LightMode } from "@mui/icons-material";
import { useSelector } from "react-redux";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate(); 
  // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")

  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;


  useEffect(() => {
    if (token) {
      navigate("/home"); 
    }
  }, [token, navigate]);

  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!data.email.trim()) {
      toast.error("Email is required");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    if (!data.password) {
      toast.error("Password is required");
      return;
    }
  
    try {
      const response = await fetch(summaryApi.signIn.url, {
        method: summaryApi.signIn.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
  
      const responseData = await response.json();
      console.log("Full Login Response:", responseData);
  
      if (responseData.success) {
        if (responseData.userData && responseData.userData.token) {
          // Ensure all fields are present
          const loginPayload = {
            user: {
              id: responseData.userData._id,
              firstName: responseData.userData.firstName,
              lastName: responseData.userData.lastName,
              email: responseData.userData.email,
              picturePath: responseData.userData.picturePath || ''
            },
            token: responseData.userData.token
          };
  
          console.log("Dispatch Payload:", loginPayload);
  
          // Dispatch login
          await dispatch(setLogin(loginPayload));
  
          toast.success(responseData.message || "Login Successful");
          navigate("/home");
        } else {
          toast.error("Invalid server response");
        }
      } else {
        toast.error(responseData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
    }
  };
  



  return (
    <section className="min-h-screen flex items-center justify-center">
      <Box
        width="100%"
        maxWidth="md"
        padding="2rem"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        boxShadow={theme.shadows[3]}
      >
        <Box
          width="100%"
          backgroundColor={theme.palette.background.alt}
          padding="1rem 6%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="1.5rem"
        >
          <Typography
            fontWeight="bold"
            fontSize="32px"
            color='primary'
          >
            ABG Social Media
          </Typography>

          {/* Theme Toggle Button */}
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
        </Box>

        <div className="relative space-y-6">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-pink-100 to-violet-200 opacity-20" />

          {/* Login header */}
          <div className="relative text-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back to ABG Social Media
            </h2>

            <p className="text-slate-500 mt-2 text-sm">
              Login to continue your experience
            </p>
          </div>

          <form 
            className="relative space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Email Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'email' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Email
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  required
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg text-slate-900 bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'email' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'password' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Password
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  required
                  value={data.password}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg text-slate-900 bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                >
                  {showPassword ? <FaRegEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'password' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98]"
            >
              Log In
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </Box>
    </section>
  );
}

export default Login;