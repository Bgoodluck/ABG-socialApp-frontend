import React, { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../../asset/signin.gif";
import { summaryApi } from "../../common";
import { toast } from "react-toastify";
import { Box, useTheme, Typography, useMediaQuery, IconButton } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from 'store/userSlice';
import { DarkMode, LightMode } from "@mui/icons-material";
import { setLogin } from 'store/userSlice';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    picture: null
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")

  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  // Improved input change handler with validation
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    
    // Optional: Add more specific validation if needed
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Improved file upload handler
  const handleUploadPic = (e) => {
    const file = e.target.files[0];

    if (file) {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        e.target.value = null; // Clear the file input
        return;
      }

      // Allowed file types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and GIF images are allowed");
        e.target.value = null; // Clear the file input
        return;
      }

      // Set the file directly
      setData((prev) => ({
        ...prev,
        picture: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive form validation
    if (!data.firstName.trim()) {
      toast.error("First Name is required");
      return;
    }

    if (!data.lastName.trim()) {
      toast.error("Last Name is required");
      return;
    }

    if (!data.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      toast.error("Password must contain at least one letter and one number");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      
      // Append picture only if it exists
      if (data.picture) {
        formData.append('picture', data.picture);
      }

      // Perform signup API call
      const response = await fetch(summaryApi.signUp.url, {
        method: summaryApi.signUp.method,
        body: formData,
        // Note: Do not set Content-Type header, let browser set it automatically for FormData
      });

      const userData = await response.json();

      console.log("Signup response:", userData);

      if (response.ok && userData.success) {
        dispatch(setLogin({
            user: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              picturePath: userData.picturePath || loginIcons, // Fallback to default icon
              // Add any other user details returned by the API
            },
            token: userData.token
          }));
        toast.success(userData.message || "Registration Successful");
        navigate("/login");
      } else {
        toast.error(userData.message || "Signup failed");
      }

    } catch (error) {
      console.error("Signup error:", error);
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

        {/* Existing signup form */}
        <div className="relative space-y-6">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-pink-100 to-violet-200 opacity-20" />

          {/* Signup header */}
          <div className="relative text-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Welcome To ABG Social Media
            </h2>

            {/* Profile Picture Upload */}
            <div className="w-20 h-20 mx-auto mt-2 mb-2 rounded-full relative">
              <img
                src={data.picture ? URL.createObjectURL(data.picture) : loginIcons}
                alt="profile"
                className="mix-blend-multiply w-20 h-20 rounded-full object-cover"
              />

              <label className="absolute bottom-0 right-0">
                <div className="text-xs bg-violet-600 text-white rounded-full cursor-pointer px-2 py-1">
                  Upload
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadPic}
                  accept="image/jpeg,image/png,image/gif"
                />
              </label>
            </div>

            <p className="text-slate-500 mt-2 text-sm">
              Register to begin your experience
            </p>
          </div>

          <form 
            className="relative space-y-6"
            onSubmit={handleSubmit}
          >
            {/* First Name Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'firstName' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                First Name
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  name="firstName"
                  required
                  value={data.firstName}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg text-slate-900 bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('firstName')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'firstName' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Last Name Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'lastName' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Last Name
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  name="lastName"
                  required
                  value={data.lastName}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg text-slate-900 bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('lastName')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'lastName' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

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

            {/* Confirm Password Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'confirmPassword' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Confirm Password
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  required
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 text-slate-900 rounded-lg bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                >
                  {showConfirmPassword ? <FaRegEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'confirmPassword' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98]"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
        
      </Box>
    </section>
  );
}

export default Signup;