export const rideTypes = [
  {
    id: '1',
    name: 'UberX',
    description: 'Affordable, everyday rides',
    capacity: 4,
    price: 15.99,
    eta: '3 min',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '2',
    name: 'Comfort',
    description: 'Newer cars with extra legroom',
    capacity: 4,
    price: 22.99,
    eta: '5 min',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '3',
    name: 'UberXL',
    description: 'Affordable rides for groups up to 6',
    capacity: 6,
    price: 27.99,
    eta: '7 min',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '4',
    name: 'Black',
    description: 'Premium rides in luxury cars',
    capacity: 4,
    price: 39.99,
    eta: '10 min',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
];

export const paymentMethods = [
  {
    id: '1',
    name: 'Personal',
    type: 'Visa',
    lastFour: '4242',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Business',
    type: 'Mastercard',
    lastFour: '5555',
    isDefault: false,
  },
  {
    id: '3',
    name: 'Cash',
    type: 'Cash',
    lastFour: '',
    isDefault: false,
  },
];