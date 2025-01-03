// import React, { useState } from 'react'
// import {
//     Box,
//     Button,
//     TextField,
//     useMediaQuery,
//     Typography,
//     useTheme
// } from "@mui/material"
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
// import { Formik } from 'formik'
// import * as yup from "yup"
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { setLogin } from 'store/userSlice'
// import Dropzone from 'react-dropzone'
// import FlexBetween from 'components/FlexBetween'
// import { summaryApi } from 'common'

// const registerSchema = yup.object().shape({
//     firstName: yup.string().required("required"),
//     lastName: yup.string().required("required"),
//     email: yup.string().email("invalid email").required("required"),
//     password: yup.string().required("required").min(8, "minimum 8 characters"),
//     confirmPassword: yup.string().required("required").oneOf([yup.ref("password"), null], "Passwords must match"),
//     picture: yup.string().required("required"),
//     location: yup.string().required("required"),
//     occupation: yup.string().required("required"),
// })

// const loginSchema = yup.object().shape({
//     email: yup.string().email("invalid email").required("required"),
//     password: yup.string().required("required"),
// })

// const initialValuesRegister = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     picture: "",
//     location: "",
//     occupation: "",
// }

// const initialValuesLogin = {
//     email: "",
//     password: "",
// }

// function Form() {
//     const [pageType, setPageType] = useState("login")
//     const { palette } = useTheme();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const isNonMobile = useMediaQuery("(min-width:600px)");
//     const isLogin = pageType === "login"
//     const isRegister = pageType === "register";




//     const register = async(values, onSubmitProps)=>{
//         try {
//             const formData = new FormData();
//         for(let value in values){
//             formData.append(value, values[value]);
//         }
//         formData.append("picture", values.picture.name)
//         const response = await fetch(summaryApi.signUp.url, {
//         method: summaryApi.signUp.method,
//         body: formData,
//         // Note: Do not set Content-Type header, let browser set it automatically for FormData
//       });
    
//       const userData = await response.json();
//       onSubmitProps.resetForm();

//       if (userData) {       
//         setPageType("login")
//       }   
    
//     } catch (error) {
//       console.error("Signup error:", error);
      
//     }
//     };

//     const login = async(values, onSubmitProps) => {
//         try {
//             const response = await fetch(summaryApi.signIn.url, {
//                 method: summaryApi.signIn.method,
//                 body: JSON.stringify(values),
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(values)
//               });
//               const userData = await response.json();
//               onSubmitProps.resetForm();
//               if (userData) {
//                 dispatch(setLogin({
//                     userId: userData._id,
//                     email: userData.email,
//                     firstName: userData.firstName,
//                     lastName: userData.lastName,
//                     picture: userData.picture,
//                     role: userData.role,
//                     location: userData.location,
//                     occupation: userData.occupation,
//                     token: userData.token,
//                 }))
//                 navigate("/home")
//               }
//         } catch (error) {
//             console.error("Login error:", error);     
//         }
//     }
    
    

//     const handleFormSubmit = async(values, onSubmitProps) => {
//         if (isLogin) {
//             await login(values, onSubmitProps)          
//         }
//         if (isRegister) {
//             await register(values, onSubmitProps)
//         }
//     };

//   return (
//     <Formik
//       onSubmit={handleFormSubmit}
//       initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
//       validationSchema={isLogin? loginSchema : registerSchema}
//     >
//        {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         setFieldValue,
//         resetForm,
//        }) =>(
//          <form onSubmit={handleSubmit}>
//              <Box
//                display="grid"
//                gap="30px"
//                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                sx={{
//                 "& > div" : { gridColumn: isNonMobile ? undefined : "span 4"}
//                }}
//              >
//                  {                    
//                     isRegister && (
//                     <>
//                      <TextField
//                         label="First Name"
//                         onBlur={handleBlur}
//                         name="firstName"
//                         value={values.firstName}
//                         onChange={handleChange}
//                         error={Boolean(touched.firstName && errors.firstName)}
//                         helperText={touched.firstName && errors.firstName}
//                         sx={{ gridColumn: "span 2"}}
//                      />

//                     <TextField
//                         label="Last Name"
//                         onBlur={handleBlur}
//                         name="lastName"
//                         value={values.lastName}
//                         onChange={handleChange}
//                         error={Boolean(touched.lastName && errors.lastName)}
//                         helperText={touched.lastName && errors.lastName}
//                         sx={{ gridColumn: "span 2"}}
//                      />

//                     <TextField
//                         label="Location"
//                         onBlur={handleBlur}
//                         name="location"
//                         value={values.location}
//                         onChange={handleChange}
//                         error={Boolean(touched.location && errors.location)}
//                         helperText={touched.location && errors.location}
//                         sx={{ gridColumn: "span 4"}}
//                      />

//                     <TextField
//                         label="Occupation"
//                         onBlur={handleBlur}
//                         name="occupation"
//                         value={values.occupation}
//                         onChange={handleChange}
//                         error={Boolean(touched.occupation && errors.occupation)}
//                         helperText={touched.occupation && errors.occupation}
//                         sx={{ gridColumn: "span 4"}}
//                      />
//                        <Box
//                          gridColumn="span 4"
//                          border={`1px solid ${palette.neutral.medium}`}
//                          borderRadius="5px"
//                          p="1rem"
//                        >
//                            <Dropzone
//                                acceptedFiles=".jpg,.jpeg,.png"
//                                multiple={false}
//                                onDrop={(acceptedFiles) => {
//                                    setFieldValue("picture", acceptedFiles[0])
//                                }}
//                            >
//                               {({
//                                 getRootProps,
//                                 getInputProps,
//                                }) => (
//                                 <Box
//                                   {...getRootProps()}
//                                   border={`2px dashed ${palette.primary.main}`}
//                                   p="1rem"
//                                   sx={{ "&:hover": { cursor: "pointer" }}}
//                                 >
//                                   <input {...getInputProps()}/>
//                                   {
//                                     !values.picture ? (
//                                         <p>Add Picture Here</p>
//                                     ) : (
//                                         <FlexBetween>
//                                             <Typography>
//                                                 {values.picture.name}
//                                                 <EditOutlinedIcon/>
//                                             </Typography>
//                                         </FlexBetween>
//                                     )
//                                   }   
//                                 </Box>
//                                )
//                               } 
//                            </Dropzone>
//                        </Box>
//                      </>
//                     )
//                  } 
//                  <TextField
//                         label="Email"
//                         onBlur={handleBlur}
//                         name="email"
//                         value={values.email}
//                         onChange={handleChange}
//                         error={Boolean(touched.email && errors.email)}
//                         helperText={touched.email && errors.email}
//                         sx={{ gridColumn: "span 4"}}
//                      />
//                      <TextField
//                         label="Password"
//                         type='password'
//                         onBlur={handleBlur}
//                         name="password"
//                         value={values.password}
//                         onChange={handleChange}
//                         error={Boolean(touched.password && errors.password)}
//                         helperText={touched.password && errors.password}
//                         sx={{ gridColumn: "span 4"}}
//                      />
//              </Box>
//              {/* Buttons */}
//              <Box>
//                  <Button
//                     fullWidth
//                     type='submit'
//                     sx={{
//                         m: "2rem 0",
//                         p: "1rem",
//                         backgroundColor: palette.primary.main,
//                         color: palette.background.alt,
//                         "&:hover": { color: palette.primary.main }                        
//                     }}
//                  >
//                       {
//                         isLogin ? "LOGIN" : "REGISTER"
//                       }
//                  </Button>
//                  <Typography
//                     onClick={()=>{
//                         setPageType(isLogin? "register" : "login")
//                         resetForm()  
//                     }}
//                     sx={{
//                         textDecoration: "underline",
//                         color: palette.primary.main,
//                         "&:hover": {
//                             color: palette.primary.light,
//                             cursor: "pointer"
//                         }
//                     }}
//                  >    
//                   {
//                     isLogin? "Don't have an account? Sign Up here" : "Already have an account? Login here"
//                   }                     
//                  </Typography>
//              </Box>
//          </form>
//        )}   
//     </Formik>
//   )
// }

// export default Form
