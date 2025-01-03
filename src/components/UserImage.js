// import { Box } from "@mui/material"

// function UserImage({ image, size = "60px" }) {

//     const filename = image.includes('\\') ? image.split('\\').pop() : image;

//     return (
//         <Box width={size} height={size}>
//              <img
//                style={{ objectFit: "cover", borderRadius: "50%"}}
//                width={size}
//                height={size}
//                alt="user"
//                src={`http://localhost:8082/uploads/${filename}`}
//               />
//         </Box>
//     )
// }

// export default UserImage;





import { Box } from "@mui/material"

function UserImage({ image, size = "60px" }) {
    // Add null/undefined check
    const filename = image && (image.includes('\\') ? image.split('\\').pop() : image);

    // If no image is provided, return null or a placeholder
    if (!image) {
        return (
            <Box width={size} height={size} sx={{ backgroundColor: '#e0e0e0', borderRadius: '50%' }}>
                {/* Optional: Add a default icon or leave empty */}
            </Box>
        );
    }

    return (
        <Box width={size} height={size}>
             <img
               style={{ objectFit: "cover", borderRadius: "50%"}}
               width={size}
               height={size}
               alt="user"
               src={`http://localhost:8082/uploads/${filename}`}
              />
        </Box>
    )
}

export default UserImage;