
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  useTheme, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { summaryApi } from 'common';
import { useSelector } from 'react-redux';

const AdvertPackage = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.medium;

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    email: user?.email || '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(summaryApi.listPackages.url, {
        method: summaryApi.listPackages.method,
        headers: {
          ...summaryApi.listPackages.headers(token)
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      
      const data = await response.json();
      if (data.success) {
        setPackages(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch packages');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPayment = async () => {
    if (!paymentMethod || !selectedPackage) return;

    const paymentData = {
      userId: user._id,
      packageId: selectedPackage._id,
      email: paymentDetails.email,
      phone: paymentDetails.phone,
      address: paymentDetails.address
    };

    try {
      const endpoint = paymentMethod === 'stripe' 
        ? summaryApi.stripeOrder.url
        : summaryApi.flutterwaveOrder.url;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment gateway
        if (paymentMethod === 'stripe' && data.session_url) {
          window.location.href = data.session_url;
        } else if (paymentMethod === 'flutterwave' && data.data?.link) {
          window.location.href = data.data.link;
        }
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message);
    }
  };

  if (loading) return (
    <WidgetWrapper>
      <Typography color={main}>Loading packages...</Typography>
    </WidgetWrapper>
  );
  
  if (error) return (
    <WidgetWrapper>
      <Typography color="error">{error}</Typography>
    </WidgetWrapper>
  );

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        <WidgetWrapper>
          <FlexBetween>
            <Typography color={dark} variant="p" fontWeight="500">
              Select Your Advertising Package
            </Typography>
          </FlexBetween>
        </WidgetWrapper>

        {packages.map((pkg) => (
          <WidgetWrapper key={pkg._id}>
            <FlexBetween>
              <div>
                <Typography color={dark} variant="h6" fontWeight="500">
                  {pkg.name}
                </Typography>
                <Typography color={medium} sx={{ mt: 1 }}>
                ₦{pkg.price}
                </Typography>
              </div>
              <Button
                variant="contained"
                size="small"
                onClick={() => handlePackageSelect(pkg)}
                sx={{
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  '&:hover': {
                    backgroundColor: palette.primary.light,
                  },
                }}
              >
                Select Package
              </Button>
            </FlexBetween>
            
            <div className="mt-4 space-y-2">
              <FlexBetween>
                <Typography color={medium}>
                  <span className="text-green-500 mr-2">✓</span>
                  Post up to {pkg.maxAdverts} adverts
                </Typography>
              </FlexBetween>
              <FlexBetween>
                <Typography color={medium}>
                  <span className="text-green-500 mr-2">✓</span>
                  Valid for {pkg.durationDays} days
                </Typography>
              </FlexBetween>
              <FlexBetween>
                <Typography color={medium}>
                  <span className="text-green-500 mr-2">✓</span>
                  Full feature access
                </Typography>
              </FlexBetween>
            </div>
          </WidgetWrapper>
        ))}
      </div>

      {/* Payment Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" color={dark}>
            Complete Your Package Purchase
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Typography color={medium} gutterBottom>
              Selected Package: {selectedPackage?.name}
            </Typography>
            <Typography color={medium} gutterBottom>
              Price: ₦{selectedPackage?.price}
            </Typography>
            <Typography color={medium} gutterBottom>
              Duration: {selectedPackage?.durationDays} days
            </Typography>
          </Box>

          <Typography variant="subtitle1" color={dark} gutterBottom>
            Select Payment Method
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            sx={{ mb: 3 }}
          >
            <FormControlLabel 
              value="stripe" 
              control={<Radio />} 
              label="Pay with Stripe" 
            />
            <FormControlLabel 
              value="flutterwave" 
              control={<Radio />} 
              label="Pay with Flutterwave" 
            />
          </RadioGroup>

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={paymentDetails.email}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={paymentDetails.phone}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={paymentDetails.address}
            onChange={handleInputChange}
            margin="normal"
            required
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsModalOpen(false)}
            sx={{ color: medium }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceedToPayment}
            variant="contained"
            disabled={!paymentMethod || !paymentDetails.email || !paymentDetails.phone || !paymentDetails.address}
            sx={{
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              '&:hover': {
                backgroundColor: palette.primary.light,
              },
            }}
          >
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdvertPackage;