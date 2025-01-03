import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";




const AdvertDisplay = ({ advert, onDelete }) => (
    <Card className="mb-4">
        <CardMedia
            component="img"
            height="200"
            image={`${process.env.REACT_APP_BACKEND_URL}${advert?.picture}`}
            alt={advert?.title}
            className="object-cover"
        />
        <CardContent>
            <Typography variant="h6" className="mb-2">
                {advert?.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="mb-2">
                {advert?.advertisement}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="mb-2">
                {advert?.description}
            </Typography>
            <Typography variant="h6" color="primary" className="mb-2">
                ${advert?.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Advert by: {advert?.userId?.firstName} {advert?.userId?.lastName}
            </Typography>
            {onDelete && (
                <Button 
                    onClick={() => onDelete(advert?._id)}
                    color="error"
                    className="mt-2"
                >
                    Delete
                </Button>
            )}
        </CardContent>
    </Card>
);

  export default AdvertDisplay;