import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [6, 12, 24, 48],
  showItemsPerPage = true,
  showInfo = true,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
      {/* Selector de elementos por página */}
      {showItemsPerPage && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Elementos por página:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              displayEmpty
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      
      {/* Paginación */}
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
      
      {/* Información de página */}
      {showInfo && (
        <Typography variant="body2" color="text.secondary">
          Página {currentPage} de {totalPages} 
          ({totalItems} elementos totales)
        </Typography>
      )}
    </Box>
  );
};

export default Pagination; 