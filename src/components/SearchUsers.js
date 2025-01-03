import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { summaryApi } from 'common';
import {
  Box,
  InputBase,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
  ClickAwayListener,
  styled
} from '@mui/material';
import { Search } from '@mui/icons-material';

// Styled components
const SearchResultItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  gap: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SearchResultsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: theme.spacing(1),
  maxHeight: '400px',
  overflow: 'auto',
  zIndex: 1000,
  boxShadow: theme.shadows[3],
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
}));

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  
  const token = useSelector((state) => state.auth.token);



  const getImageUrl = (picturePath) => {
    if (!picturePath) return '';
    
    // If it's already a full URL, return as is
    if (picturePath.startsWith('http')) return picturePath;
    
    // Convert backslashes to forward slashes
    const formattedPath = picturePath.replace(/\\/g, '/');
    
    // Construct the full URL (adjust the base URL according to your backend)
    // You might want to get this from an environment variable or config
    return `${process.env.REACT_APP_BACKEND_URL}/${formattedPath}`;
  };




  const searchUsers = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${summaryApi.searchForUsers.url}?query=${encodeURIComponent(query)}`, {
        method: summaryApi.searchForUsers.method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
           
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      console.log("search", data)
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm) {
      searchTimeout.current = setTimeout(() => {
        searchUsers(searchTerm);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const handleUserClick = (user) => {
    navigate(`/profile/${user._id}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <SearchContainer>
        <Paper
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Search sx={{ p: '10px', color: 'text.secondary' }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
          />
          {isLoading && (
            <CircularProgress size={20} sx={{ mx: 1 }} />
          )}
        </Paper>

        {isOpen && (searchTerm || isLoading) && (
          <SearchResultsContainer>
            {results.length > 0 ? (
              results.map((user) => (
                <SearchResultItem
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar
                    src={getImageUrl(user?.picture || user?.picturePath)}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    sx={{ width: 40, height: 40 }} 
                  >
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      {user.firstName} {user.lastName}
                    </Typography>
                    {user.location && (
                      <Typography variant="body2" color="text.secondary">
                        {user.location}
                      </Typography>
                    )}
                  </Box>
                </SearchResultItem>
              ))
            ) : searchTerm ? (
              <Box p={2} textAlign="center">
                <Typography color="text.secondary">
                  No users found
                </Typography>
              </Box>
            ) : null}
          </SearchResultsContainer>
        )}
      </SearchContainer>
    </ClickAwayListener>
  );
};

export default SearchUsers;