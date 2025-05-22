import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer, customer, CustomersData, CustomersResponse } from './customers_thunk';


interface CustomerState {
  data: CustomersData | null;
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}

const initialState: CustomerState = {
  data: null,
  customers: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  },
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // You can add regular reducers here if needed
    clearCustomersError: (state) => {
      state.error = null;
    },
    setCustomersPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(customer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(
        customer.fulfilled,
        (state, action: PayloadAction<CustomersResponse>) => {
          state.loading = false;
          state.data = action.payload.data.customers;
          state.customers = action.payload.data.customers.list.data;
          
          // Update pagination info
          state.pagination = {
            currentPage: action.payload.data.customers.list.current_page,
            totalPages: action.payload.data.customers.list.last_page,
            totalItems: action.payload.data.customers.list.total,
            perPage: action.payload.data.customers.list.per_page,
          };
        }
      )
      // Handle rejected state
      .addCase(customer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch customers';
      });
  },
});

// Export actions
export const { clearCustomersError, setCustomersPage } = customerSlice.actions;

// Export reducer
export default customerSlice.reducer;

// Export selectors
export const selectAllCustomers = (state: { customers: CustomerState }) => 
  state.customers.customers;

export const selectCustomersData = (state: { customers: CustomerState }) =>
  state.customers.data;

export const selectCustomersLoading = (state: { customers: CustomerState }) =>
  state.customers.loading;

export const selectCustomersError = (state: { customers: CustomerState }) =>
  state.customers.error;

export const selectCustomersPagination = (state: { customers: CustomerState }) =>
  state.customers.pagination;