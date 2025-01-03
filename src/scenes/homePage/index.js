// import { Box, useMediaQuery } from '@mui/material'
// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import Navbar from 'scenes/navbar'
// import UserWidget from 'scenes/widgets/UserWidget'

// function HomePage() {

//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")
//   const { _id, picturePath } = useSelector((state) => state.auth.user)


//   useEffect(() => {
//     console.log("HomePage - User ID:", _id)
//     console.log("HomePage - Picture Path:", picturePath)
//   }, [_id, picturePath])


//   return (
//     <Box>
//       <Navbar/>
//       <Box
//         width="100%"
//         padding="2rem 6%"
//         display={isNonMobileScreens ? "flex" : "block"}
//         justifyContent="space-between"
//         gap="0.5rem"
//       >
//           <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
//               <UserWidget userId={_id} picturePath={picturePath}/>
//           </Box>
//           <Box 
//             flexBasis={isNonMobileScreens? "42%" : undefined}
//             mt={isNonMobileScreens ? undefined : "2rem"}
//             >

//             </Box>
//             {isNonMobileScreens && (
//               <Box flexBasis="26%">
                  
//               </Box>
//             )}
//       </Box>
//     </Box>
//   )
// }

// export default HomePage


import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from 'scenes/navbar'
import UserWidget from 'scenes/widgets/UserWidget'
import MyPostWidget from "scenes/widgets/MyPostWidget"
import SinglePostWidget from 'scenes/widgets/SinglePostWidget'
import AllPostsWidget from 'scenes/widgets/AllPostsWidget'
import AdvertWidget from 'scenes/widgets/Advertisement/AdvertWidget'
import FriendListWidget from 'scenes/widgets/FriendListWidget'
import { useParams } from 'react-router-dom'
import AdvertsComponent from 'scenes/widgets/Advertisement/AdvertsComponent'
import AdvertPackage from 'scenes/widgets/Advertisement/AdvertPackage'

function HomePage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")

  const { livePostId } = useParams();
  
  // Note the change from _id to id
  const { id, picturePath } = useSelector((state) => state.auth.user || {})

  // Debug logging
  useEffect(() => {
    
    console.log("HomePage - User ID:", id)
    console.log("HomePage - Picture Path:", picturePath)
  }, [id, picturePath])

  return (
    <Box>
      <Navbar/>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
        gap="0.5rem"
      >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
              {id && (
                <UserWidget 
                  userId={id} 
                  picturePath={picturePath || ''}
                />
              )}
              <AdvertsComponent/>
          </Box>
          <Box 
            flexBasis={isNonMobileScreens? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            {/* my posts */}
            <MyPostWidget picturePath={picturePath}/>
            <AllPostsWidget userId={id} livePostId={livePostId}/>
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis="26%">
              {/* Content for this box */}
              <AdvertWidget/>
              <AdvertPackage/>
              <Box m="2rem 0"/>
              <FriendListWidget userId={id} />
            </Box>
          )}
      </Box>
    </Box>
  )
}

export default HomePage