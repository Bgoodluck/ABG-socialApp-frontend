import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { summaryApi } from 'common';

function StripeVerify() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
   
    // Get auth state
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Check each required value individually for better error messages
                if (!orderId) {
                    throw new Error('Order ID is missing');
                }
                if (!user?.id) {  // Changed from _id to id
                    throw new Error('User ID is not available');
                }
                if (!token) {
                    throw new Error('Authentication token is missing');
                }

                const response = await fetch(`${summaryApi.stripeVerify.url}?userId=${user.id}`, {  // Changed from _id to id
                    method: summaryApi.stripeVerify.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        orderId,
                        success
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Server error during verification');
                }

                const responseData = await response.json();
                
                if (responseData.success) {
                    toast.success('Payment successful');
                    navigate('/');
                } else {
                    throw new Error(responseData.message || 'Payment verification failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                toast.error(error.message);
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setIsLoading(false);
            }
        };

        // Only attempt verification if we have all required data
        if (success && orderId && user?.id && token) { 
            verifyPayment();
        } else {
            const timeout = setTimeout(() => {
                setIsLoading(false);
                if (!user?.id || !token) { 
                    toast.error('Please log in to verify payment');
                } else if (!orderId || !success) {
                    toast.error('Invalid payment verification URL');
                }
                navigate('/');
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [success, orderId, user, token, navigate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-xl mb-4">Verifying payment...</p>
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <p className="text-xl">Redirecting...</p>
            </div>
        </div>
    );
}

export default StripeVerify;