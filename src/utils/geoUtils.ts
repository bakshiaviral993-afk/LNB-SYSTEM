// Geo distance calculation & mock geolocation utilities

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  areaName?: string;
  cityName?: string;
}

// 12+ Demo branches with coordinates across major Indian tech & financial clusters
export interface EnhancedBranchGeo {
  id: string;
  name: string;
  code: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  address: string;
  operatingHours: string;
  contactNumber: string;
  availableCounts: {
    Small: number;
    Medium: number;
    Large: number;
    'Extra Large': number;
  };
  pricingPerYear: {
    Small: number;
    Medium: number;
    Large: number;
    'Extra Large': number;
  };
  isOpenNow: boolean;
  waitingListQueue?: number;
}

export const DEMO_BRANCHES_GEO: EnhancedBranchGeo[] = [
  // NAVI MUMBAI & THANE CLUSTER
  {
    id: 'br-nm-01',
    name: 'Vashi Sector 17 Flagship Vault',
    code: 'SV-VSH-01',
    city: 'Navi Mumbai',
    area: 'Sector 17, Vashi',
    latitude: 19.077065,
    longitude: 72.998993,
    address: 'Plot 32, Arenja Arcade, Sector 17, Vashi, Navi Mumbai 400703',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 22 2789 4410',
    availableCounts: { Small: 3, Medium: 2, Large: 1, 'Extra Large': 0 },
    pricingPerYear: { Small: 2500, Medium: 4500, Large: 7800, 'Extra Large': 12500 },
    isOpenNow: true,
  },
  {
    id: 'br-nm-02',
    name: 'Seawoods Grand Central Hub',
    code: 'SV-SWD-02',
    city: 'Navi Mumbai',
    area: 'Seawoods West',
    latitude: 19.0205,
    longitude: 73.0189,
    address: 'Tower 2, Commercial Complex, Seawoods Grand Central, Navi Mumbai 400706',
    operatingHours: '09:30 AM - 05:00 PM (Mon-Sat)',
    contactNumber: '+91 22 2772 8820',
    availableCounts: { Small: 5, Medium: 4, Large: 2, 'Extra Large': 1 },
    pricingPerYear: { Small: 2500, Medium: 4500, Large: 7800, 'Extra Large': 12500 },
    isOpenNow: true,
  },
  {
    id: 'br-nm-03',
    name: 'CBD Belapur Financial Center',
    code: 'SV-CBD-03',
    city: 'Navi Mumbai',
    area: 'Sector 11, CBD Belapur',
    latitude: 19.0185,
    longitude: 73.0402,
    address: 'Kukreja Center, Sector 11, CBD Belapur, Navi Mumbai 400614',
    operatingHours: '10:00 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 22 2757 3390',
    availableCounts: { Small: 0, Medium: 0, Large: 0, 'Extra Large': 0 },
    pricingPerYear: { Small: 2500, Medium: 4500, Large: 7800, 'Extra Large': 12500 },
    isOpenNow: true,
    waitingListQueue: 14,
  },
  {
    id: 'br-nm-04',
    name: 'Kharghar Central Park Branch',
    code: 'SV-KHG-04',
    city: 'Navi Mumbai',
    area: 'Sector 20, Kharghar',
    latitude: 19.0432,
    longitude: 73.0689,
    address: 'Near Central Park Metro Station, Sector 20, Kharghar, Navi Mumbai 410210',
    operatingHours: '09:30 AM - 04:00 PM (Mon-Sat)',
    contactNumber: '+91 22 2774 1900',
    availableCounts: { Small: 2, Medium: 1, Large: 0, 'Extra Large': 0 },
    pricingPerYear: { Small: 2500, Medium: 4500, Large: 7800, 'Extra Large': 12500 },
    isOpenNow: false,
  },

  // MUMBAI METRO
  {
    id: 'br-mum-01',
    name: 'Nariman Point Flagship Vault',
    code: 'SV-NPT-01',
    city: 'Mumbai',
    area: 'Nariman Point',
    latitude: 18.9269,
    longitude: 72.8229,
    address: 'Free Press House, 4th Floor, Free Press Journal Marg, Nariman Point, Mumbai 400021',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 22 2288 4101',
    availableCounts: { Small: 2, Medium: 3, Large: 1, 'Extra Large': 1 },
    pricingPerYear: { Small: 3000, Medium: 5200, Large: 8900, 'Extra Large': 14000 },
    isOpenNow: true,
  },
  {
    id: 'br-mum-02',
    name: 'BKC Financial Towers Branch',
    code: 'SV-BKC-02',
    city: 'Mumbai',
    area: 'Bandra Kurla Complex',
    latitude: 19.0657,
    longitude: 72.8687,
    address: 'G Block, Platina Tower, Bandra Kurla Complex, Bandra East, Mumbai 400051',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 22 2654 8920',
    availableCounts: { Small: 4, Medium: 2, Large: 2, 'Extra Large': 1 },
    pricingPerYear: { Small: 3000, Medium: 5200, Large: 8900, 'Extra Large': 14000 },
    isOpenNow: true,
  },
  {
    id: 'br-mum-04',
    name: 'Powai Hiranandani Vault',
    code: 'SV-POW-04',
    city: 'Mumbai',
    area: 'Powai',
    latitude: 19.1176,
    longitude: 72.906,
    address: 'High Street, Galleria Complex, Hiranandani Gardens, Powai, Mumbai 400076',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 22 2570 3390',
    availableCounts: { Small: 1, Medium: 1, Large: 0, 'Extra Large': 0 },
    pricingPerYear: { Small: 2800, Medium: 4900, Large: 8200, 'Extra Large': 13000 },
    isOpenNow: true,
  },

  // PUNE
  {
    id: 'br-pun-01',
    name: 'Shivajinagar Heritage Branch',
    code: 'SV-SHV-01',
    city: 'Pune',
    area: 'Shivajinagar',
    latitude: 18.5314,
    longitude: 73.8446,
    address: 'JM Road, Opposite Sambhaji Park, Shivajinagar, Pune 411005',
    operatingHours: '09:30 AM - 04:00 PM (Mon-Sat)',
    contactNumber: '+91 20 2553 4401',
    availableCounts: { Small: 6, Medium: 3, Large: 2, 'Extra Large': 0 },
    pricingPerYear: { Small: 2200, Medium: 4000, Large: 7000, 'Extra Large': 11000 },
    isOpenNow: true,
  },
  {
    id: 'br-pun-02',
    name: 'Baner High Street Hub',
    code: 'SV-BNR-02',
    city: 'Pune',
    area: 'Baner',
    latitude: 18.559,
    longitude: 73.7868,
    address: 'Baner Road, Near Pancard Club Junction, Baner, Pune 411045',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 20 2729 8812',
    availableCounts: { Small: 3, Medium: 2, Large: 1, 'Extra Large': 1 },
    pricingPerYear: { Small: 2200, Medium: 4000, Large: 7000, 'Extra Large': 11000 },
    isOpenNow: true,
  },

  // DELHI NCR
  {
    id: 'br-del-01',
    name: 'Connaught Place Premier Branch',
    code: 'SV-DEL-01',
    city: 'Delhi',
    area: 'Connaught Place',
    latitude: 28.6315,
    longitude: 77.2167,
    address: 'Block E, Inner Circle, Connaught Place, New Delhi 110001',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 11 2341 8801',
    availableCounts: { Small: 4, Medium: 3, Large: 1, 'Extra Large': 1 },
    pricingPerYear: { Small: 3000, Medium: 5200, Large: 8900, 'Extra Large': 14000 },
    isOpenNow: true,
  },
  {
    id: 'br-del-02',
    name: 'South Extension II Vault',
    code: 'SV-DEL-02',
    city: 'Delhi',
    area: 'South Extension',
    latitude: 28.5729,
    longitude: 77.2215,
    address: 'Main Market, South Extension Part II, New Delhi 110049',
    operatingHours: '10:00 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 11 2625 4410',
    availableCounts: { Small: 0, Medium: 0, Large: 0, 'Extra Large': 0 },
    pricingPerYear: { Small: 3000, Medium: 5200, Large: 8900, 'Extra Large': 14000 },
    isOpenNow: true,
    waitingListQueue: 8,
  },

  // BENGALURU
  {
    id: 'br-blr-01',
    name: 'MG Road Central Vault',
    code: 'SV-BLR-01',
    city: 'Bengaluru',
    area: 'MG Road',
    latitude: 12.9756,
    longitude: 77.6066,
    address: 'Brigade Towers, Mahatma Gandhi Road, Bengaluru 560001',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 80 2558 7701',
    availableCounts: { Small: 7, Medium: 5, Large: 2, 'Extra Large': 1 },
    pricingPerYear: { Small: 2600, Medium: 4700, Large: 8000, 'Extra Large': 12800 },
    isOpenNow: true,
  },
  {
    id: 'br-blr-02',
    name: 'Indiranagar 100ft Road Branch',
    code: 'SV-BLR-02',
    city: 'Bengaluru',
    area: 'Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    operatingHours: '09:30 AM - 04:30 PM (Mon-Sat)',
    contactNumber: '+91 80 2521 9904',
    availableCounts: { Small: 2, Medium: 1, Large: 0, 'Extra Large': 0 },
    pricingPerYear: { Small: 2600, Medium: 4700, Large: 8000, 'Extra Large': 12800 },
    isOpenNow: true,
  }
];

// Haversine formula calculation for spherical distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Fallback demo location: Navi Mumbai (Vashi / Arenja Arcade)
export const DEFAULT_DEMO_COORDINATES: GeoCoordinate = {
  latitude: 19.0772,
  longitude: 72.9985,
  areaName: 'Vashi Sector 17',
  cityName: 'Navi Mumbai',
};

// Reverse geocode centroid lookup based on lat/lng (no API keys required)
export function reverseGeocodeMock(lat: number, lng: number): { areaName: string; cityName: string } {
  // Find closest centroid from known metro hubs
  const centroids = [
    { city: 'Navi Mumbai', area: 'Vashi / Sector 17', lat: 19.077, lng: 72.999 },
    { city: 'Navi Mumbai', area: 'Seawoods / Belapur', lat: 19.02, lng: 73.02 },
    { city: 'Mumbai', area: 'Bandra Kurla Complex (BKC)', lat: 19.066, lng: 72.868 },
    { city: 'Mumbai', area: 'South Mumbai / Nariman Point', lat: 18.927, lng: 72.823 },
    { city: 'Mumbai', area: 'Andheri East / Chakala', lat: 19.115, lng: 72.869 },
    { city: 'Pune', area: 'Shivajinagar / JM Road', lat: 18.531, lng: 73.845 },
    { city: 'Pune', area: 'Baner / Balewadi', lat: 18.559, lng: 73.787 },
    { city: 'Delhi', area: 'Connaught Place / Central', lat: 28.632, lng: 77.217 },
    { city: 'Delhi', area: 'South Extension / Ring Road', lat: 28.573, lng: 77.222 },
    { city: 'Bengaluru', area: 'MG Road / Central Business Dist', lat: 12.976, lng: 77.607 },
    { city: 'Bengaluru', area: 'Indiranagar / East Bengaluru', lat: 12.978, lng: 77.641 },
  ];

  let nearest = centroids[0];
  let minDistance = Infinity;

  for (const c of centroids) {
    const dist = calculateDistanceKm(lat, lng, c.lat, c.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = c;
    }
  }

  return { areaName: nearest.area, cityName: nearest.city };
}
