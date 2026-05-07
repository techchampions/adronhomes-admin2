// // src/pages/Gifts/demoData.ts
// // import { GiftData, GiftStats, GiftProperty } from '../../types/giftTypes';

// import { GiftData, GiftProperty, GiftStats } from "../../type";

// export const demoGifts: GiftData[] = [

//   {
//     id: 5,
//     giftName: "Gift Cards Bulk",
//     giftType: "Vouchers",
//     estimatedValue: 100000,
//     totalQuantity: 100,
//     quantityPerProperty: 2,
//     measurementUnit: "cards",
//     status: 'inactive',
//     createdAt: "2024-01-05",
//     description: "Multi-store gift cards valid at over 50 retailers",
//     // image: "/giftcard-placeholder.png"
//   },
//   {
//     id: 6,
//     giftName: "Home Theater System",
//     giftType: "Electronics",
//     estimatedValue: 450000,
//     totalQuantity: 15,
//     quantityPerProperty: 1,
//     measurementUnit: "system",
//     status: 'active',
//     createdAt: "2024-02-15",
//     description: "Premium 7.1 channel home theater with 4K projector",
//     // image: "/theater-placeholder.png"
//   },
//   {
//     id: 7,
//     giftName: "Spa & Wellness Package",
//     giftType: "Wellness",
//     estimatedValue: 80000,
//     totalQuantity: 40,
//     quantityPerProperty: 1,
//     measurementUnit: "package",
//     status: 'pending',
//     createdAt: "2024-02-20",
//     description: "Luxury spa treatment packages including massages and facials",
//     // image: "/spa-placeholder.png"
//   },
//   {
//     id: 8,
//     giftName: "Fine Dining Experience",
//     giftType: "Experience",
//     estimatedValue: 120000,
//     totalQuantity: 35,
//     quantityPerProperty: 2,
//     measurementUnit: "vouchers",
//     status: 'active',
//     createdAt: "2024-02-25",
//     description: "Premium dining vouchers for top restaurants in the city",
//     // image: "/dining-placeholder.png"
//   },
//   {
//     id: 9,
//     giftName: "Gym Membership",
//     giftType: "Wellness",
//     estimatedValue: 60000,
//     totalQuantity: 60,
//     quantityPerProperty: 1,
//     measurementUnit: "membership",
//     status: 'active',
//     createdAt: "2024-03-01",
//     description: "One year premium gym membership",
//     // image: "/gym-placeholder.png"
//   },
//   {
//     id: 10,
//     giftName: "Laptop Bundle",
//     giftType: "Electronics",
//     estimatedValue: 350000,
//     totalQuantity: 20,
//     quantityPerProperty: 1,
//     measurementUnit: "piece",
//     status: 'pending',
//     createdAt: "2024-03-05",
//     description: "High-performance laptop with accessories bundle",

//   }
// ];

// export const demoGiftStats: GiftStats = {
//   totalGifts: 10,
//   totalRequests: 156,
//   pendingRequests: 23,
//   activatedGifts: 6
// };

// export const demoGiftProperties: GiftProperty[] = [
//   { id: 1, giftId: 1, propertyId: 101, propertyName: 'Luxury Villa in Banana Island', quantity: 1, status: 'fulfilled', assignedAt: '2024-02-01' },
//   { id: 2, giftId: 1, propertyId: 102, propertyName: 'Modern Apartment in Lekki', quantity: 1, status: 'pending', assignedAt: '2024-02-15' },
//   { id: 3, giftId: 1, propertyId: 103, propertyName: 'Commercial Complex in VI', quantity: 1, status: 'approved', assignedAt: '2024-02-10' },
//   { id: 4, giftId: 2, propertyId: 104, propertyName: 'Beachfront Property in Eko Atlantic', quantity: 1, status: 'fulfilled', assignedAt: '2024-01-20' },
//   { id: 5, giftId: 2, propertyId: 105, propertyName: 'Penthouse in Ikoyi', quantity: 1, status: 'approved', assignedAt: '2024-02-05' },
//   { id: 6, giftId: 3, propertyId: 106, propertyName: 'Townhouse in Ajah', quantity: 1, status: 'pending', assignedAt: '2024-02-18' },
//   { id: 7, giftId: 4, propertyId: 107, propertyName: 'Office Space in Maryland', quantity: 1, status: 'fulfilled', assignedAt: '2024-02-12' },
//   { id: 8, giftId: 6, propertyId: 108, propertyName: 'Retail Store in Ikeja', quantity: 1, status: 'fulfilled', assignedAt: '2024-02-22' },
//   { id: 9, giftId: 6, propertyId: 109, propertyName: 'Warehouse in Ogun State', quantity: 1, status: 'pending', assignedAt: '2024-03-01' },
//   { id: 10, giftId: 8, propertyId: 110, propertyName: 'Co-working Space in Yaba', quantity: 2, status: 'approved', assignedAt: '2024-02-28' },
//   { id: 11, giftId: 9, propertyId: 111, propertyName: 'Residential Estate in Abeokuta', quantity: 1, status: 'pending', assignedAt: '2024-03-10' },
//   { id: 12, giftId: 10, propertyId: 112, propertyName: 'Mixed-use Development in Lekki', quantity: 1, status: 'pending', assignedAt: '2024-03-08' },
// ];

// export const giftRequests = [
//   { id: 1, giftId: 1, propertyId: 102, propertyName: 'Modern Apartment in Lekki', status: 'pending', requestedAt: '2024-03-01' },
//   { id: 2, giftId: 3, propertyId: 106, propertyName: 'Townhouse in Ajah', status: 'pending', requestedAt: '2024-03-02' },
//   { id: 3, giftId: 6, propertyId: 109, propertyName: 'Warehouse in Ogun State', status: 'pending', requestedAt: '2024-03-03' },
//   { id: 4, giftId: 9, propertyId: 111, propertyName: 'Residential Estate in Abeokuta', status: 'pending', requestedAt: '2024-03-04' },
//   { id: 5, giftId: 10, propertyId: 112, propertyName: 'Mixed-use Development in Lekki', status: 'pending', requestedAt: '2024-03-05' },
// ];