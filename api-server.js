/**
 * PawsCause - Community Pet Care & Rescue Platform
 * Express.js Backend Server
 * 
 * Provides REST API endpoints for:
 * - Module 1: New Pet Owners (register single/multiple pets under user profile, retrieve saved pets)
 * - Module 2: Community Stray Care (tag strays, upload photos, record Health Index tags)
 * - Module 3: Rescue Task Force (lost & found tracker, rescue confirmations, gamified leaderboard with badges)
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;

// Enable JSON body parsing with large limit for image data URLs
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static file serving for standalone mode
app.use(express.static(__dirname));

// ==========================================
// PERSISTENT DATA STORAGE (JSON Database on Disk)
// ==========================================
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'pawscause_db.json');
const DB_BAK_FILE = path.join(DATA_DIR, 'pawscause_db.bak.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

// Initial seed data (including Alex Rivera's Rocky and original community records)
const initialPets = [
  {
    id: 'pet-1',
    name: 'Milo',
    species: 'Dog (Golden Retriever)',
    age: '2.5 years',
    weight: '28 kg',
    breeder: 'Sunny Valley Kennel',
    localArea: 'Highland Park',
    ownerName: 'Sarah Jenkins',
    ownerContact: 'sarah.j@example.com',
    registeredAt: '2026-08-14T10:30:00.000Z',
    notes: 'Microchipped, loves agility balls, very friendly with puppies in Highland Park',
    photo: null,
    governmentLicense: 'sample-gov-license-gold',
    governmentLicenseNumber: 'GOV-MUNI-HP-2026-0914',
    licenseAttachedAt: '2026-08-14T11:00:00.000Z'
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'Cat (Domestic Shorthair)',
    age: '1 year',
    weight: '4.2 kg',
    breeder: 'City Animal Rescue Sanctuary',
    localArea: 'Oakwood North',
    ownerName: 'David Kim',
    ownerContact: 'david.k@example.com',
    registeredAt: '2026-08-20T14:15:00.000Z',
    notes: 'Indoor cat, fully vaccinated, loves window bird-watching',
    photo: null,
    governmentLicense: null,
    governmentLicenseNumber: null
  },
  {
    id: 'pet-3',
    name: 'Cooper',
    species: 'Dog (Australian Shepherd)',
    age: '3 years',
    weight: '22 kg',
    breeder: 'Blue Ridge Working Dogs',
    localArea: 'Highland Park',
    ownerName: 'Sarah Jenkins',
    ownerContact: 'sarah.j@example.com',
    registeredAt: '2026-09-02T09:00:00.000Z',
    notes: 'High energy working companion, loves frisbee in the park',
    photo: null,
    governmentLicense: null,
    governmentLicenseNumber: null
  },
  {
    id: 'pet-4',
    name: 'Bella',
    species: 'Dog (French Bulldog)',
    age: '8 months',
    weight: '11 kg',
    breeder: 'Crestview Ethical Breeders',
    localArea: 'Downtown Central',
    ownerName: 'Elena Rostova',
    ownerContact: 'elena.r@example.com',
    registeredAt: '2026-09-10T16:45:00.000Z',
    notes: 'Sensitive stomach, gentle demeanor, social with small breeds',
    photo: null,
    governmentLicense: 'sample-gov-license-blue',
    governmentLicenseNumber: 'GOV-MUNI-DC-2026-3382',
    licenseAttachedAt: '2026-09-10T17:00:00.000Z'
  },
  {
    id: 'pet-5',
    name: 'Buster',
    species: 'Dog (Beagle)',
    age: '2 years',
    weight: '14 kg',
    breeder: 'Oakwood Hound Haven',
    localArea: 'Highland Park',
    ownerName: 'Carlos Mendez',
    ownerContact: 'carlos.m@example.com',
    registeredAt: '2026-09-12T11:20:00.000Z',
    notes: 'Super curious beagle, loves trail walking and sniffing around Highland Park',
    photo: null,
    governmentLicense: null,
    governmentLicenseNumber: null
  },
  {
    id: 'pet-6',
    name: 'Mochi',
    species: 'Dog (Corgi)',
    age: '1.5 years',
    weight: '12 kg',
    breeder: 'Sunny Acres Pups',
    localArea: 'Oakwood North',
    ownerName: 'Emma Watson',
    ownerContact: 'emma.w@example.com',
    registeredAt: '2026-09-15T15:10:00.000Z',
    notes: 'Playful corgi, loves belly rubs and greeting neighborhood dogs on morning strolls',
    photo: null,
    governmentLicense: 'sample-gov-license-green',
    governmentLicenseNumber: 'GOV-MUNI-ON-2026-4402',
    licenseAttachedAt: '2026-09-15T16:00:00.000Z'
  },
  {
    id: 'pet-7',
    name: 'Rocky',
    species: 'Dog (Boxer)',
    age: '2 years',
    weight: '30 kg',
    breeder: 'Valley Rescue',
    localArea: 'Highland Park',
    ownerName: 'Alex Rivera',
    ownerContact: 'alex.r@example.com',
    registeredAt: '2026-09-23T14:35:53.997Z',
    notes: 'Loves tennis balls and running in the morning park.',
    photo: null,
    governmentLicense: 'sample-gov-license-gold',
    governmentLicenseNumber: 'GOV-MUNI-HP-2026-1102',
    licenseAttachedAt: '2026-09-23T15:00:00.000Z'
  },
  {
    id: 'pet-1790502157835-971',
    name: 'Shiro',
    species: 'Dog (Golden Retriever)',
    age: '3 years',
    weight: '4 kg',
    breeder: 'Bruno Pet Farm',
    localArea: 'Anna Nagar',
    ownerName: 'Sarah Jenkins',
    ownerContact: 'sarah.jenkins.pets@gmail.com',
    registeredAt: '2026-09-27T09:42:37.835Z',
    notes: 'Likes Squeaky toys, Loves morning walk in Anna Nagar park',
    photo: null,
    governmentLicense: 'sample-gov-license-gold',
    governmentLicenseNumber: 'GOV-MUNI-AN-2026-9710',
    licenseAttachedAt: '2026-09-27T09:42:37.835Z'
  },
  {
    id: 'pet-1790175852783-289',
    name: 'Niki',
    species: 'Dog (Shih Tzu)',
    age: '1 year',
    weight: '4 kg',
    breeder: 'RM Dog Kennel',
    localArea: 'Anna Nagar',
    ownerName: 'Rishi Balaji',
    ownerContact: 'rishibalaji122009@gmail.com',
    registeredAt: '2026-09-23T15:04:12.783Z',
    notes: 'Loves to interact with people and other dogs, very friendly in Anna Nagar parks',
    photo: null,
    governmentLicense: 'sample-gov-license-gold',
    governmentLicenseNumber: 'GOV-MUNI-AN-2026-1029',
    licenseAttachedAt: '2026-09-23T16:00:00.000Z'
  },
  {
    id: 'pet-anna-1',
    name: 'Simba',
    species: 'Dog (Golden Retriever)',
    age: '2 years',
    weight: '26 kg',
    breeder: 'Anna Nagar Ethical Paws Sanctuary',
    localArea: 'Anna Nagar',
    ownerName: 'Priya Sharma',
    ownerContact: 'priya.sharma.paws@gmail.com',
    registeredAt: '2026-09-24T09:15:00.000Z',
    notes: 'Loves morning walks along Anna Nagar Tower Park, microchipped and very playful with kids and other pets.',
    photo: null,
    governmentLicense: 'sample-gov-license-blue',
    governmentLicenseNumber: 'GOV-MUNI-AN-2026-3391',
    licenseAttachedAt: '2026-09-24T10:00:00.000Z'
  },
  {
    id: 'pet-anna-2',
    name: 'Bruno',
    species: 'Dog (Indie Rescue)',
    age: '3 years',
    weight: '19 kg',
    breeder: 'Chennai Animal Welfare Rescue',
    localArea: 'Anna Nagar',
    ownerName: 'Kavitha Sundaram',
    ownerContact: 'kavitha.sundaram.pets@gmail.com',
    registeredAt: '2026-09-25T11:20:00.000Z',
    notes: 'Rescued Indie pup, vaccinated, trained and calm demeanor. Loves frisbee and socializing with neighborhood dogs.',
    photo: null,
    governmentLicense: 'sample-gov-license-green',
    governmentLicenseNumber: 'GOV-MUNI-AN-2026-4428',
    licenseAttachedAt: '2026-09-25T12:00:00.000Z'
  },
  {
    id: 'pet-anna-3',
    name: 'Leo',
    species: 'Dog (Labrador Retriever)',
    age: '2.5 years',
    weight: '30 kg',
    breeder: 'Blue Cross Certified Foster',
    localArea: 'Anna Nagar',
    ownerName: 'Arjun Ramanathan',
    ownerContact: 'arjun.ramanathan.paws@gmail.com',
    registeredAt: '2026-09-25T14:40:00.000Z',
    notes: 'Very gentle lab, loves swimming, fetch at Anna Nagar ground, healthy diet and active daily walker.',
    photo: null,
    governmentLicense: 'sample-gov-license-gold',
    governmentLicenseNumber: 'GOV-MUNI-AN-2026-5519',
    licenseAttachedAt: '2026-09-25T15:00:00.000Z'
  }
];

const initialStrays = [
  {
    id: 'stray-1',
    nickname: 'Rusty',
    visualDescription: 'Medium brown and white mixed-breed hound. Scruffy coat, floppy left ear, tail has a white tip. Very timid but takes treats from distance.',
    localArea: 'Market Square / 4th Ave Alley',
    healthIndex: ['Skin Infection', 'Wounded'],
    reporterName: 'Marcus Vance',
    timestamp: '2026-09-22T08:15:00.000Z',
    status: 'Triage In-Progress',
    photo: null,
    triageLevel: 'High',
    notes: 'Spotted resting behind produce market pallets.'
  },
  {
    id: 'stray-2',
    nickname: 'Barnaby',
    visualDescription: 'Large tan indie dog with dark muzzle. Limping on front right leg. Frequents the bakery dumpster around dawn.',
    localArea: 'East Industrial Depot',
    healthIndex: ['Broken Limb'],
    reporterName: 'Aria Chen',
    timestamp: '2026-09-21T17:40:00.000Z',
    status: 'Vet Dispatch Requested',
    photo: null,
    triageLevel: 'Urgent',
    notes: 'Transport carrier needed for veterinary triage.'
  },
  {
    id: 'stray-3',
    nickname: 'Shadow',
    visualDescription: 'Small black terrier mix, missing left hind foot from an older healed trauma. Active, energetic, regularly fed by community bodega.',
    localArea: 'Cedar Heights Playground',
    healthIndex: ['Missing Limb'],
    reporterName: 'David Kim',
    timestamp: '2026-09-19T11:20:00.000Z',
    status: 'Monitored by Neighborhood',
    photo: null,
    triageLevel: 'Medium',
    notes: 'Community feeder schedule active.'
  }
];

const initialLostFound = [
  {
    id: 'lf-1',
    petName: 'Rocky',
    status: 'Lost',
    species: 'Dog (Beagle)',
    description: 'Tricolor Beagle with red nylon collar. Answers to Rocky, loves squeaky toys. Ran off near Sunset Trailhead.',
    lastSeenLocation: 'Sunset Trailhead / West Woods',
    lastSeenDate: '2026-09-22',
    contactName: 'Amanda Price',
    contactPhone: '9840292192',
    reunitedBy: null,
    reunitedAt: null,
    photo: null
  },
  {
    id: 'lf-2',
    petName: 'Found Husky Mix (Unnamed)',
    status: 'Found',
    species: 'Dog (Siberian Husky)',
    description: 'Found wandering near Pine & 8th Street intersection. Blue eyes, grey coat, no microchip found at initial scan.',
    lastSeenLocation: 'Pine & 8th Street',
    lastSeenDate: '2026-09-21',
    contactName: 'Marcus Vance',
    contactPhone: '9876524144',
    reunitedBy: null,
    reunitedAt: null,
    photo: null
  },
  {
    id: 'lf-3',
    petName: 'Mochi',
    status: 'Reunited',
    species: 'Cat (Calico)',
    description: 'Slipped out of balcony screen. Found hiding safely under neighbor garden shed 2 days later.',
    lastSeenLocation: 'Maple Heights, Apt 4B',
    lastSeenDate: '2026-09-18',
    contactName: 'Elena Rostova',
    contactPhone: '9840314188',
    reunitedBy: 'Elena Rostova',
    reunitedAt: '2026-09-20T14:30:00.000Z',
    photo: null
  }
];

const initialLeaderboard = [
  {
    id: 'rescuer-1',
    name: 'Elena Rostova',
    role: 'Lead Community Tracker',
    phone: '9840314188',
    petsFound: 34,
    missionsCompleted: 42,
    avatarColor: '#d97706',
    recentRescue: 'Mochi (Calico Cat)',
    joinedDate: '2025-11-10'
  },
  {
    id: 'rescuer-2',
    name: 'Marcus Vance',
    role: 'Neighborhood Watch Patrol',
    phone: '9876524144',
    petsFound: 24,
    missionsCompleted: 29,
    avatarColor: '#0284c7',
    recentRescue: 'Found Husky Mix',
    joinedDate: '2026-01-15'
  },
  {
    id: 'rescuer-3',
    name: 'Aria Chen',
    role: 'Animal First-Aid Responder',
    phone: '9840732195',
    petsFound: 14,
    missionsCompleted: 18,
    avatarColor: '#7c3aed',
    recentRescue: 'Stray Barnaby Triage',
    joinedDate: '2026-03-04'
  },
  {
    id: 'rescuer-4',
    name: 'David Kim',
    role: 'Search & Rescue Volunteer',
    phone: '9840890177',
    petsFound: 7,
    missionsCompleted: 11,
    avatarColor: '#059669',
    recentRescue: 'Shadow health monitoring',
    joinedDate: '2026-05-18'
  },
  {
    id: 'rescuer-5',
    name: 'Sarah Jenkins',
    role: 'Community Foster Parent',
    phone: '9840412182',
    petsFound: 3,
    missionsCompleted: 5,
    avatarColor: '#e11d48',
    recentRescue: 'Lost kitten in Oakwood',
    joinedDate: '2026-07-22'
  }
];

const initialPuppiesLaid = [
  {
    id: 'puppies-1',
    registeredBy: 'Rishi',
    area: 'Anna Nagar',
    phoneNumber: '9876543210',
    puppyCount: 5,
    motherCondition: 'Nursing, healthy, mother dog resting under shelter',
    notes: 'Mother dog gave birth near community park corner. Shelter and clean water provided.',
    status: 'Monitored / Pending Govt Check',
    registeredAt: '2026-09-24T10:30:00.000Z'
  },
  {
    id: 'puppies-2',
    registeredBy: 'Marcus Vance',
    area: 'Oakwood North',
    phoneNumber: '9876524144',
    puppyCount: 4,
    motherCondition: 'Alert, protective of puppies, requires nutrition support',
    notes: 'Near 58 Oak Avenue warehouse alley. Volunteer feeding arranged.',
    status: 'Govt Veterinary Team Assigned',
    registeredAt: '2026-09-25T14:15:00.000Z'
  }
];

const initialVeterinarians = [
  {
    id: 'vet-1',
    name: 'Dr. Elena Roberts, DVM',
    phoneNumber: '(555) 234-8891',
    clinicName: 'Highland Paws Veterinary Hospital',
    openTime: '08:00 AM',
    closeTime: '07:00 PM',
    clinicTime: '08:00 AM – 07:00 PM',
    visitFee: '₹350',
    address: '142 Highland Blvd, Suite 200',
    area: 'Highland Park',
    services: 'General Care, Emergency Triage, Vaccinations, Ultrasound',
    registeredAt: '2026-08-01T09:00:00.000Z'
  },
  {
    id: 'vet-2',
    name: 'Dr. Marcus Reed, BVSc',
    phoneNumber: '(555) 345-9922',
    clinicName: 'Oakwood Companion Animal Clinic',
    openTime: '08:30 AM',
    closeTime: '06:00 PM',
    clinicTime: '08:30 AM – 06:00 PM',
    visitFee: '₹300',
    address: '58 Oak Avenue, Suite 101',
    area: 'Oakwood North',
    services: 'Dental Surgery, Microchipping, Senior Pet Care, Diagnostics',
    registeredAt: '2026-08-10T10:15:00.000Z'
  },
  {
    id: 'vet-3',
    name: 'Dr. Sophia Patel, DVM',
    phoneNumber: '(555) 456-1188',
    clinicName: 'Downtown Metro Pet Health & Urgent Care',
    openTime: '07:30 AM',
    closeTime: '09:00 PM',
    clinicTime: '07:30 AM – 09:00 PM',
    visitFee: '₹500',
    address: '310 Market Square, Building B',
    area: 'Downtown',
    services: '24/7 Urgent Care, Orthopedics, Soft Tissue Surgery, Critical Care',
    registeredAt: '2026-08-15T11:30:00.000Z'
  },
  {
    id: 'vet-4',
    name: 'Dr. Rajesh Kumar, MVSc',
    phoneNumber: '(555) 789-3344',
    clinicName: 'Anna Nagar Canine & Feline Specialty Clinic',
    openTime: '08:00 AM',
    closeTime: '08:00 PM',
    clinicTime: '08:00 AM – 08:00 PM',
    visitFee: '₹250',
    address: '24 2nd Avenue, Roundana Junction',
    area: 'Anna Nagar',
    services: 'Preventive Healthcare, Dermatology, Vaccination, Pet Wellness',
    registeredAt: '2026-08-22T08:45:00.000Z'
  },
  {
    id: 'vet-5',
    name: 'Dr. Arthur Pendelton, DVM',
    phoneNumber: '(555) 567-2233',
    clinicName: 'Highland Park Community Vet Center',
    openTime: '09:00 AM',
    closeTime: '05:30 PM',
    clinicTime: '09:00 AM – 05:30 PM',
    visitFee: '₹400',
    address: '88 Meadowlark Lane',
    area: 'Highland Park',
    services: 'Preventive Care, Spay & Neuter, Canine Agility Health',
    registeredAt: '2026-09-01T14:00:00.000Z'
  }
];

// Initial Seed Data for Pet Essentials (Pet Stores & Pet Spas)
const initialPetStores = [
  {
    id: 'store-1',
    storeName: 'Paws & Whiskers Mega Pet Store',
    storeAddress: '104 Highland Blvd, Suite 10',
    area: 'Highland Park',
    phoneNumber: '(555) 782-9011',
    gmail: 'pawsandwhiskers.store@gmail.com',
    registeredAt: '2026-08-10T11:00:00.000Z',
    products: [
      {
        id: 'prod-1',
        name: 'Royal Canin Adult Dog Nutrition (3kg)',
        price: '₹1,850',
        category: 'Food',
        image: 'sample-food',
        description: 'Complete balanced nutrition for medium breed adult dogs, enriched with antioxidants and prebiotics.'
      },
      {
        id: 'prod-2',
        name: 'Heavy-Duty Braided Nylon Leash (6ft)',
        price: '₹499',
        category: 'Leashes & Harnesses',
        image: 'sample-leash',
        description: 'Weatherproof chew-resistant walking leash with padded ergonomic foam handle.'
      },
      {
        id: 'prod-3',
        name: 'Interactive Dental Rubber Squeaky Ball',
        price: '₹299',
        category: 'Toys',
        image: 'sample-toy',
        description: 'BPA-free natural rubber toy designed to clean gums and soothe teething habits.'
      }
    ]
  },
  {
    id: 'store-2',
    storeName: 'Tail Waggers Boutique & Pet Nutrition',
    storeAddress: '45 Anna Nagar Main Road, Roundana',
    area: 'Anna Nagar',
    phoneNumber: '9876543220',
    gmail: 'tailwaggers.annanagar@gmail.com',
    registeredAt: '2026-08-18T14:30:00.000Z',
    products: [
      {
        id: 'prod-4',
        name: 'Whiskas Ocean Fish Gourmet Cat Food (1.2kg)',
        price: '₹620',
        category: 'Food',
        image: 'sample-catfood',
        description: 'Rich in Omega-3 and taurine for sharp eyesight, lustrous coat and urinary tract wellness.'
      },
      {
        id: 'prod-5',
        name: 'Orthopedic Velvet Memory Foam Pet Bed (Large)',
        price: '₹2,450',
        category: 'Beds & Accessories',
        image: 'sample-bed',
        description: 'Ultra-soft machine washable velvet pet lounger providing joint relief for resting dogs & cats.'
      }
    ]
  },
  {
    id: 'store-3',
    storeName: 'Oakwood Pet Haven & Essentials',
    storeAddress: '72 Pine Valley Road, Suite 3B, Oakwood North',
    area: 'Oakwood North',
    phoneNumber: '(555) 432-8819',
    gmail: 'oakwood.pethaven@gmail.com',
    registeredAt: '2026-09-02T09:45:00.000Z',
    products: [
      {
        id: 'prod-6',
        name: 'Herbal Neem & Aloe Vera Dog Shampoo (500ml)',
        price: '₹450',
        category: 'Grooming & Care',
        image: 'sample-shampoo',
        description: 'Hypoallergenic pH-neutral organic anti-itch and flea repelling coat formula.'
      },
      {
        id: 'prod-7',
        name: 'Night Glow Reflective No-Pull Harness',
        price: '₹899',
        category: 'Leashes & Harnesses',
        image: 'sample-harness',
        description: 'Dual-lead safety chest vest with reflective 3M safety piping for evening strolls.'
      }
    ]
  },
  {
    id: 'store-4',
    storeName: 'Highland Bark & Purr Provisions',
    storeAddress: '118 Highland Blvd, Highland Park',
    area: 'Highland Park',
    phoneNumber: '(555) 782-4411',
    gmail: 'highland.barkprovisions@gmail.com',
    registeredAt: '2026-08-22T10:15:00.000Z',
    products: [
      {
        id: 'prod-8',
        name: 'Grain-Free Salmon & Sweet Potato Kibble (2.5kg)',
        price: '₹1,650',
        category: 'Food',
        image: 'sample-food',
        description: 'Natural grain-free recipe supporting sensitive stomachs and skin allergies.'
      },
      {
        id: 'prod-9',
        name: 'Tough Chew Natural Rubber Bone Toy',
        price: '₹349',
        category: 'Toys',
        image: 'sample-toy',
        description: 'Durable puncture-resistant rubber bone for active chewers.'
      }
    ]
  },
  {
    id: 'store-5',
    storeName: 'Meadowlark Canine & Feline Market',
    storeAddress: '88 Meadowlark Lane, Highland Park',
    area: 'Highland Park',
    phoneNumber: '(555) 782-2200',
    gmail: 'meadowlark.petmarket@gmail.com',
    registeredAt: '2026-08-28T16:00:00.000Z',
    products: [
      {
        id: 'prod-10',
        name: 'Stainless Steel Non-Tip Dual Bowls',
        price: '₹550',
        category: 'Beds & Accessories',
        image: 'sample-bed',
        description: 'Heavy duty rust-proof feeding station with non-slip silicone base ring.'
      },
      {
        id: 'prod-11',
        name: 'Dental Mint Chew Sticks (Pack of 15)',
        price: '₹280',
        category: 'Food',
        image: 'sample-food',
        description: 'Freshens breath, fights tartar buildup, and supports healthy oral hygiene.'
      }
    ]
  },
  {
    id: 'store-6',
    storeName: 'Anna Nagar Pet World & Feed Hub',
    storeAddress: '36 3rd Avenue, Anna Nagar East, Anna Nagar',
    area: 'Anna Nagar',
    phoneNumber: '9876541122',
    gmail: 'annanagar.pethub@gmail.com',
    registeredAt: '2026-08-30T11:40:00.000Z',
    products: [
      {
        id: 'prod-12',
        name: 'Drools Focus Super Premium Puppy Food (3kg)',
        price: '₹1,450',
        category: 'Food',
        image: 'sample-food',
        description: 'Complete nutritional formula fortified with DHA for healthy brain & muscle growth.'
      },
      {
        id: 'prod-13',
        name: 'Reflective Walking Collar with Safety Bell',
        price: '₹220',
        category: 'Leashes & Harnesses',
        image: 'sample-harness',
        description: 'Quick release soft padded collar with high-visibility nighttime threading.'
      }
    ]
  },
  {
    id: 'store-7',
    storeName: 'Oakwood Woods & Paws Market',
    storeAddress: '91 Oakwood North Drive, Oakwood North',
    area: 'Oakwood North',
    phoneNumber: '(555) 432-9900',
    gmail: 'oakwood.woodspaws@gmail.com',
    registeredAt: '2026-09-08T13:20:00.000Z',
    products: [
      {
        id: 'prod-14',
        name: 'Organic Lavender Coat Deodorizing Spray (250ml)',
        price: '₹380',
        category: 'Grooming & Care',
        image: 'sample-shampoo',
        description: 'Alcohol-free fur freshener spray neutralizing pet odor between salon baths.'
      }
    ]
  },
  {
    id: 'store-8',
    storeName: 'Metro Paws City Pet Supply',
    storeAddress: '310 Market Square, Downtown Central',
    area: 'Downtown Central',
    phoneNumber: '(555) 911-3044',
    gmail: 'metropaws.downtown@gmail.com',
    registeredAt: '2026-09-12T15:30:00.000Z',
    products: [
      {
        id: 'prod-15',
        name: 'Purina Pro Plan Sensitive Skin & Stomach (2.5kg)',
        price: '₹1,950',
        category: 'Food',
        image: 'sample-food',
        description: 'High-protein oat meal and salmon kibble supporting lustrous skin and coat vitality.'
      }
    ]
  }
];

const initialPetSpas = [
  {
    id: 'spa-1',
    spaName: 'Fur & Bubble Luxury Pet Spa',
    contactNumber: '(555) 782-5533',
    gmail: 'furbubble.spa@gmail.com',
    location: '118 Highland Blvd, Suite A, Highland Park',
    address: '118 Highland Blvd, Suite A, Highland Park',
    area: 'Highland Park',
    registeredAt: '2026-08-12T10:00:00.000Z',
    services: [
      {
        id: 'srv-1',
        serviceName: 'Full Dog Spa & Warm Hydro-Bubble Bath',
        packageName: 'Full Dog Spa & Warm Hydro-Bubble Bath',
        forPet: '🐶 Dogs (All Breeds)',
        cost: '₹850',
        duration: '60 mins',
        description: 'Warm hydro-massage wash, deep coat shampooing, high-velocity blow dry, ear cleaning & paw balm.'
      },
      {
        id: 'srv-2',
        serviceName: 'Cat Grooming & Fur De-Shedding',
        packageName: 'Cat Grooming & Fur De-Shedding',
        forPet: '🐱 Cats (All Breeds)',
        cost: '₹650',
        duration: '45 mins',
        description: 'Gentle feline dry-bath, loose fur de-shedding brush, sanitary trim and claw smoothing.'
      },
      {
        id: 'srv-3',
        serviceName: 'Aromatherapy & Herbal Coat Conditioning',
        packageName: 'Aromatherapy & Herbal Coat Conditioning',
        forPet: '🐾 Dogs & Cats (All Pets)',
        cost: '₹450',
        duration: '30 mins',
        description: 'Organic lavender and chamomile oil massage soothing itchy skin and leaving silky fur.'
      },
      {
        id: 'srv-4',
        serviceName: 'Deluxe Paws & Claws Nail Trimming',
        packageName: 'Deluxe Paws & Claws Nail Trimming',
        forPet: '🐾 Dogs & Cats (All Pets)',
        cost: '₹200',
        duration: '15 mins',
        description: 'Precision safety nail clip with electric filing and moisturizing paw pad butter.'
      }
    ]
  },
  {
    id: 'spa-2',
    spaName: 'Velvet Paws Grooming Studio & Pet Salon',
    contactNumber: '9876541188',
    gmail: 'velvetpaws.groom@gmail.com',
    location: '36 3rd Avenue, Anna Nagar East, Anna Nagar',
    address: '36 3rd Avenue, Anna Nagar East, Anna Nagar',
    area: 'Anna Nagar',
    registeredAt: '2026-08-25T13:15:00.000Z',
    services: [
      {
        id: 'srv-5',
        serviceName: 'Complete Breed-Specific Show Styling & Haircut',
        packageName: 'Complete Breed-Specific Show Styling & Haircut',
        forPet: '🐕 Dogs (Breed Specific)',
        cost: '₹1,200',
        duration: '90 mins',
        description: 'Custom scissor styling for poodles, shih tzus, and retrievers with blueberry facial scrub.'
      },
      {
        id: 'srv-6',
        serviceName: 'Medicated Anti-Tick & Flea Dip Treatment',
        packageName: 'Medicated Anti-Tick & Flea Dip Treatment',
        forPet: '🐾 Dogs & Cats (All Pets)',
        cost: '₹750',
        duration: '45 mins',
        description: 'Veterinary approved medicated wash that eradicates parasites and prevents re-infestation.'
      },
      {
        id: 'srv-7',
        serviceName: 'Puppy First Spa Experience (Under 6 Mos)',
        packageName: 'Puppy First Spa Experience (Under 6 Mos)',
        forPet: '🐶 Puppies / Kittens',
        cost: '₹500',
        duration: '40 mins',
        description: 'Gentle positive-reinforcement bath, gentle brush, and playful desensitization.'
      }
    ]
  },
  {
    id: 'spa-3',
    spaName: 'Oakwood Oasis Pet Wellness & Hydrotherapy Spa',
    contactNumber: '(555) 901-2244',
    gmail: 'oakwood.petspa@gmail.com',
    location: '91 Oakwood North Drive, Oakwood North',
    address: '91 Oakwood North Drive, Oakwood North',
    area: 'Oakwood North',
    registeredAt: '2026-09-05T15:00:00.000Z',
    services: [
      {
        id: 'srv-8',
        serviceName: 'Hydrotherapy Canine Jacuzzi Bath',
        packageName: 'Hydrotherapy Canine Jacuzzi Bath',
        forPet: '🐶 Dogs (All Breeds)',
        cost: '₹950',
        duration: '50 mins',
        description: 'Therapeutic warm whirlpool water jets to relieve joint stiffness and muscle soreness.'
      },
      {
        id: 'srv-9',
        serviceName: 'Deep Fur Detangling & De-Matting Care',
        packageName: 'Deep Fur Detangling & De-Matting Care',
        forPet: '🐾 Dogs & Cats (All Pets)',
        cost: '₹600',
        duration: '60 mins',
        description: 'Painless detangling with leave-in botanical conditioner sprays for matted fur.'
      }
    ]
  },
  {
    id: 'spa-4',
    spaName: 'Highland Pampered Paws Salon & Spa',
    contactNumber: '(555) 782-7722',
    gmail: 'pamperedpaws.highland@gmail.com',
    location: '104 Highland Blvd, Highland Park',
    address: '104 Highland Blvd, Highland Park',
    area: 'Highland Park',
    registeredAt: '2026-08-30T14:00:00.000Z',
    services: [
      {
        id: 'srv-10',
        serviceName: 'Deluxe Warm Hydrobath & Coat Conditioning',
        packageName: 'Deluxe Warm Hydrobath & Coat Conditioning',
        forPet: '🐶 Dogs (All Breeds)',
        cost: '₹750',
        duration: '50 mins',
        description: 'Warm soothing hydro-bath with natural oatmeal shampoo and silky blow dry.'
      },
      {
        id: 'srv-11',
        serviceName: 'Herbal Pawdicure & Coat Detangling',
        packageName: 'Herbal Pawdicure & Coat Detangling',
        forPet: '🐾 Dogs & Cats (All Pets)',
        cost: '₹350',
        duration: '25 mins',
        description: 'Organic shea butter paw soak, nail trimming, and gentle tangle comb-out.'
      }
    ]
  },
  {
    id: 'spa-5',
    spaName: 'Anna Nagar Royal Canine Spa & Hydrotherapy',
    contactNumber: '9876548899',
    gmail: 'royalcaninespa.annanagar@gmail.com',
    location: '45 Anna Nagar Main Road, Roundana, Anna Nagar',
    address: '45 Anna Nagar Main Road, Roundana, Anna Nagar',
    area: 'Anna Nagar',
    registeredAt: '2026-09-01T12:00:00.000Z',
    services: [
      {
        id: 'srv-12',
        serviceName: 'Full Aromatherapy Grooming & Hydro-Jet Bath',
        packageName: 'Full Aromatherapy Grooming & Hydro-Jet Bath',
        forPet: '🐶 Dogs (All Breeds)',
        cost: '₹899',
        duration: '60 mins',
        description: 'Medicated therapeutic water bath with botanical skin soothers and ear cleaning.'
      },
      {
        id: 'srv-13',
        serviceName: 'Puppy & Kitten Gentle First Groom',
        packageName: 'Puppy & Kitten Gentle First Groom',
        forPet: '🐶 Puppies / Kittens',
        cost: '₹450',
        duration: '35 mins',
        description: 'Low-stress gentle introduction to grooming with soft brush and warm dry towel wrap.'
      }
    ]
  },
  {
    id: 'spa-6',
    spaName: 'Downtown Central Glow Paws Salon',
    contactNumber: '(555) 911-7788',
    gmail: 'glowpaws.downtown@gmail.com',
    location: '310 Market Square, Downtown Central',
    address: '310 Market Square, Downtown Central',
    area: 'Downtown Central',
    registeredAt: '2026-09-10T16:00:00.000Z',
    services: [
      {
        id: 'srv-14',
        serviceName: 'Express Wash & Fluff Blowout',
        packageName: 'Express Wash & Fluff Blowout',
        forPet: '🐾 Dogs & Cats (All Pets)',
        cost: '₹500',
        duration: '30 mins',
        description: 'Quick revitalizing wash, ear wipe, and fluff dry for active neighborhood pets.'
      }
    ]
  }
];

// Initial Seed Accounts (Google Mail Only with Physical Street Addresses)
const initialAccounts = [
  {
    id: 'acc-1',
    email: 'sarah.jenkins.pets@gmail.com',
    name: 'Sarah Jenkins',
    area: 'Anna Nagar',
    address: '24 4th Main Road, Anna Nagar',
    phone: '9840412182',
    avatarColor: '#e11d48',
    avatarEmoji: '🐶',
    role: 'Guardian & Foster Parent',
    createdAt: '2026-08-14T10:30:00.000Z',
    lastLoginAt: '2026-09-27T09:44:26.479Z'
  },
  {
    id: 'acc-2',
    email: 'alex.r.paws@gmail.com',
    name: 'Alex Rivera',
    area: 'Highland Park',
    address: '118 Highland Blvd, Highland Park',
    phone: '9876524139',
    avatarColor: '#0284c7',
    avatarEmoji: '🐕',
    role: 'Active Pet Guardian',
    createdAt: '2026-09-23T14:35:53.000Z',
    lastLoginAt: '2026-09-26T07:45:00.000Z'
  },
  {
    id: 'acc-3',
    email: 'carlos.mendez.paws@gmail.com',
    name: 'Carlos Mendez',
    area: 'Highland Park',
    address: '88 Meadowlark Lane, Highland Park',
    phone: '9840192199',
    avatarColor: '#10b981',
    avatarEmoji: '🐾',
    role: 'Beagle Guardian',
    createdAt: '2026-09-12T11:20:00.000Z',
    lastLoginAt: '2026-09-25T16:20:00.000Z'
  },
  {
    id: 'acc-4',
    email: 'rishibalaji122009@gmail.com',
    name: 'Rishi Balaji',
    area: 'Anna Nagar',
    address: '45 Anna Nagar Main Road, Roundana, Anna Nagar',
    phone: '9876543210',
    avatarColor: '#f59e0b',
    avatarEmoji: '🦁',
    role: 'Community Triage Lead',
    createdAt: '2026-09-24T10:30:00.000Z',
    lastLoginAt: '2026-09-27T09:44:00.677Z'
  },
  {
    id: 'acc-anna-1',
    email: 'priya.sharma.paws@gmail.com',
    name: 'Priya Sharma',
    area: 'Anna Nagar',
    address: '18 3rd Avenue, Anna Nagar East, Anna Nagar',
    phone: '9840123456',
    avatarColor: '#ec4899',
    avatarEmoji: '🐕',
    role: 'Pet Guardian & Community Member',
    createdAt: '2026-09-20T10:00:00.000Z',
    lastLoginAt: '2026-09-27T08:00:00.000Z'
  },
  {
    id: 'acc-anna-2',
    email: 'kavitha.sundaram.pets@gmail.com',
    name: 'Kavitha Sundaram',
    area: 'Anna Nagar',
    address: '72 2nd Avenue, Anna Nagar',
    phone: '9840987654',
    avatarColor: '#10b981',
    avatarEmoji: '🐾',
    role: 'Animal Welfare Volunteer & Pet Guardian',
    createdAt: '2026-09-21T11:00:00.000Z',
    lastLoginAt: '2026-09-27T08:15:00.000Z'
  },
  {
    id: 'acc-anna-3',
    email: 'arjun.ramanathan.paws@gmail.com',
    name: 'Arjun Ramanathan',
    area: 'Anna Nagar',
    address: '52 4th Main Road, Anna Nagar West, Anna Nagar',
    phone: '9840555666',
    avatarColor: '#6366f1',
    avatarEmoji: '🐶',
    role: 'Community Pet Guardian',
    createdAt: '2026-09-22T09:30:00.000Z',
    lastLoginAt: '2026-09-27T08:30:00.000Z'
  },
  {
    id: 'acc-5',
    email: 'david.kim.care@gmail.com',
    name: 'David Kim',
    area: 'Oakwood North',
    address: '72 Pine Valley Road, Oakwood North',
    phone: '9840890177',
    avatarColor: '#8b5cf6',
    avatarEmoji: '🐱',
    role: 'Volunteer Rescuer',
    createdAt: '2026-08-20T14:15:00.000Z',
    lastLoginAt: '2026-09-25T12:00:00.000Z'
  },
  {
    id: 'acc-6',
    email: 'elena.rostova@gmail.com',
    name: 'Elena Rostova',
    area: 'Downtown Central',
    address: '310 Market Square, Downtown Central',
    phone: '9840314188',
    avatarColor: '#d97706',
    avatarEmoji: '🦊',
    role: 'Lead Community Tracker',
    createdAt: '2026-09-10T16:45:00.000Z',
    lastLoginAt: '2026-09-26T06:30:00.000Z'
  }
];

// Initial Login Logs & Security Activity Tracker
const initialLoginLogs = [
  {
    id: 'log-1',
    email: 'sarah.jenkins.pets@gmail.com',
    name: 'Sarah Jenkins',
    area: 'Highland Park',
    timestamp: '2026-09-26T08:10:00.000Z',
    type: 'LOGIN_SUCCESS',
    details: 'Signed in via Google Mail',
    device: 'Chrome Web Client (Active Session)',
    ip: '192.168.1.10'
  },
  {
    id: 'log-2',
    email: 'alex.r.paws@gmail.com',
    name: 'Alex Rivera',
    area: 'Highland Park',
    timestamp: '2026-09-26T07:45:00.000Z',
    type: 'ACCOUNT_SWITCH',
    details: 'Account profile switched in Highland Park',
    device: 'Mobile Web Client',
    ip: '192.168.1.15'
  },
  {
    id: 'log-3',
    email: 'carlos.mendez.paws@gmail.com',
    name: 'Carlos Mendez',
    area: 'Highland Park',
    timestamp: '2026-09-25T16:20:00.000Z',
    type: 'LOGIN_SUCCESS',
    details: 'Logged into Pocas network from Highland Park zone',
    device: 'Firefox Desktop',
    ip: '192.168.1.44'
  },
  {
    id: 'log-4',
    email: 'rishibalaji122009@gmail.com',
    name: 'Rishi Balaji',
    area: 'Anna Nagar',
    timestamp: '2026-09-26T08:15:00.000Z',
    type: 'LOGIN_SUCCESS',
    details: 'Signed in via Google Mail from Anna Nagar zone',
    device: 'Chrome Web Client',
    ip: '10.0.0.8'
  }
];

// Active Stores
let petsStore = [...initialPets];
let straysStore = [...initialStrays];
let lostFoundStore = [...initialLostFound];
let leaderboardStore = [...initialLeaderboard];
let veterinariansStore = [...initialVeterinarians];
let petStoresStore = [...initialPetStores];
let petSpasStore = [...initialPetSpas];
let puppiesLaidStore = [...initialPuppiesLaid];
let accountsStore = [...initialAccounts];
let loginLogsStore = [...initialLoginLogs];

// Persistent Load & Save Utilities
export function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.petsStore) && parsed.petsStore.length > 0) {
        petsStore = parsed.petsStore.map(p => {
          const init = initialPets.find(ip => ip.id === p.id);
          return {
            ...p,
            name: p.name || p.petName || (init ? init.name : 'Companion Pet'),
            governmentLicense: p.governmentLicense !== undefined ? p.governmentLicense : (init ? init.governmentLicense : null),
            governmentLicenseNumber: p.governmentLicenseNumber !== undefined ? p.governmentLicenseNumber : (init ? init.governmentLicenseNumber : null),
            licenseAttachedAt: p.licenseAttachedAt !== undefined ? p.licenseAttachedAt : (init ? init.licenseAttachedAt : null)
          };
        });

        // Ensure all community seed pets (including Anna Nagar neighborhood pets Simba, Bruno, Leo, and Shiro) are present
        const existingPetIds = new Set(petsStore.map(p => p.id));
        const missingPets = initialPets.filter(p => !existingPetIds.has(p.id));
        if (missingPets.length > 0) {
          petsStore.push(...missingPets);
        }
      }
      if (parsed && Array.isArray(parsed.straysStore) && parsed.straysStore.length > 0) {
        straysStore = parsed.straysStore;
      }
      if (parsed && Array.isArray(parsed.lostFoundStore) && parsed.lostFoundStore.length > 0) {
        lostFoundStore = parsed.lostFoundStore;
      }
      if (parsed && Array.isArray(parsed.leaderboardStore) && parsed.leaderboardStore.length > 0) {
        leaderboardStore = parsed.leaderboardStore;
      }
      if (parsed && Array.isArray(parsed.veterinariansStore) && parsed.veterinariansStore.length > 0) {
        veterinariansStore = parsed.veterinariansStore.map(v => {
          let fee = v.visitFee || '₹300';
          // Convert legacy dollar representation if present
          if (typeof fee === 'string' && fee.startsWith('$')) {
            const num = parseFloat(fee.replace(/[^0-9.]/g, ''));
            fee = isNaN(num) ? '₹300' : `₹${Math.round(num * 10)}`;
          }
          return {
            ...v,
            visitFee: fee
          };
        });
      } else {
        veterinariansStore = [...initialVeterinarians];
      }
      if (parsed && Array.isArray(parsed.petStoresStore) && parsed.petStoresStore.length > 0) {
        const existingIds = new Set(parsed.petStoresStore.map(s => s.id));
        const missing = initialPetStores.filter(s => !existingIds.has(s.id));
        petStoresStore = [...parsed.petStoresStore, ...missing];
      } else {
        petStoresStore = [...initialPetStores];
      }
      if (parsed && Array.isArray(parsed.petSpasStore) && parsed.petSpasStore.length > 0) {
        const existingIds = new Set(parsed.petSpasStore.map(s => s.id));
        const missing = initialPetSpas.filter(s => !existingIds.has(s.id));
        petSpasStore = [...parsed.petSpasStore, ...missing];
      } else {
        petSpasStore = [...initialPetSpas];
      }
      if (parsed && Array.isArray(parsed.puppiesLaidStore) && parsed.puppiesLaidStore.length > 0) {
        puppiesLaidStore = parsed.puppiesLaidStore;
      } else {
        puppiesLaidStore = [...initialPuppiesLaid];
      }
      if (parsed && Array.isArray(parsed.accountsStore) && parsed.accountsStore.length > 0) {
        accountsStore = parsed.accountsStore.map(acc => {
          const init = initialAccounts.find(ia => ia.email.toLowerCase() === acc.email.toLowerCase());
          return {
            ...acc,
            address: acc.address || (init ? init.address : (acc.area ? `24 4th Main Road, ${acc.area}` : '24 4th Main Road, Anna Nagar'))
          };
        });

        // Ensure missing neighborhood seed accounts (Priya Sharma, Kavitha Sundaram, Arjun Ramanathan) are present
        const existingEmails = new Set(accountsStore.map(a => a.email.toLowerCase()));
        const missingAccounts = initialAccounts.filter(a => !existingEmails.has(a.email.toLowerCase()));
        if (missingAccounts.length > 0) {
          accountsStore.push(...missingAccounts);
        }

        // Check if Sarah Jenkins has registered a pet in Anna Nagar (e.g. Shiro)
        const sarahAcc = accountsStore.find(a => a.email.toLowerCase().includes('jenkins'));
        const hasAnnaPet = petsStore.some(p => 
          (p.localArea && p.localArea.toLowerCase().includes('anna')) &&
          ((p.ownerName && p.ownerName.toLowerCase().includes('sara')) || (p.ownerContact && p.ownerContact.toLowerCase().includes('jenkins')))
        );
        if (sarahAcc && hasAnnaPet) {
          sarahAcc.area = 'Anna Nagar';
          if (!sarahAcc.address || !sarahAcc.address.toLowerCase().includes('anna')) {
            sarahAcc.address = '24 4th Main Road, Anna Nagar';
          }
        }
      } else {
        accountsStore = [...initialAccounts];
      }
      if (parsed && Array.isArray(parsed.loginLogsStore) && parsed.loginLogsStore.length > 0) {
        loginLogsStore = parsed.loginLogsStore;
      } else {
        loginLogsStore = [...initialLoginLogs];
      }
      console.log(`💾 [Persistent DB] Loaded from disk: ${petsStore.length} pets, ${straysStore.length} strays, ${lostFoundStore.length} reports, ${veterinariansStore.length} vets, ${petStoresStore.length} pet stores, ${petSpasStore.length} pet spas, ${puppiesLaidStore.length} puppies reports, ${accountsStore.length} accounts, ${loginLogsStore.length} login logs.`);
      saveDb();
      return;
    }
  } catch (err) {
    console.error('⚠️ [Persistent DB] Read error, falling back to backup or initial seed:', err);
    try {
      if (fs.existsSync(DB_BAK_FILE)) {
        const bakContent = fs.readFileSync(DB_BAK_FILE, 'utf8');
        const bakParsed = JSON.parse(bakContent);
        if (bakParsed.petsStore) petsStore = bakParsed.petsStore;
        if (bakParsed.straysStore) straysStore = bakParsed.straysStore;
        if (bakParsed.lostFoundStore) lostFoundStore = bakParsed.lostFoundStore;
        if (bakParsed.leaderboardStore) leaderboardStore = bakParsed.leaderboardStore;
        if (bakParsed.veterinariansStore) {
          veterinariansStore = bakParsed.veterinariansStore.map(v => {
            let fee = v.visitFee || '₹300';
            if (typeof fee === 'string' && fee.startsWith('$')) {
              const num = parseFloat(fee.replace(/[^0-9.]/g, ''));
              fee = isNaN(num) ? '₹300' : `₹${Math.round(num * 10)}`;
            }
            return {
              ...v,
              visitFee: fee
            };
          });
        }
        if (bakParsed.petStoresStore && Array.isArray(bakParsed.petStoresStore)) {
          petStoresStore = bakParsed.petStoresStore;
        }
        if (bakParsed.petSpasStore && Array.isArray(bakParsed.petSpasStore)) {
          petSpasStore = bakParsed.petSpasStore;
        }
        if (bakParsed.puppiesLaidStore && Array.isArray(bakParsed.puppiesLaidStore)) {
          puppiesLaidStore = bakParsed.puppiesLaidStore;
        }
        if (bakParsed.accountsStore && Array.isArray(bakParsed.accountsStore)) {
          accountsStore = bakParsed.accountsStore;
        }
        if (bakParsed.loginLogsStore && Array.isArray(bakParsed.loginLogsStore)) {
          loginLogsStore = bakParsed.loginLogsStore;
        }
        console.log('💾 [Persistent DB] Successfully recovered from backup file.');
        return;
      }
    } catch (e) {
      console.error('⚠️ [Persistent DB] Backup recovery failed:', e);
    }
  }
  // If file does not exist yet, write the seed database
  saveDb();
}

export function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = {
      petsStore,
      straysStore,
      lostFoundStore,
      leaderboardStore,
      veterinariansStore,
      petStoresStore,
      petSpasStore,
      puppiesLaidStore,
      accountsStore,
      loginLogsStore,
      updatedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_FILE, jsonStr, 'utf8');
    // Keep a secondary copy for extra safety
    fs.writeFileSync(DB_BAK_FILE, jsonStr, 'utf8');
  } catch (err) {
    console.error('⚠️ [Persistent DB] Write error:', err);
  }
}

// Immediately load disk database on startup
loadDb();

// Helper: Calculate Badge according to exact requirements:
// Beginner (1-10 pets found)
// Elite (10-20 pets found)
// Diamond (20-30 pets found)
// Master (30+ pets found)
export function calculateBadge(petsFound) {
  const count = Number(petsFound) || 0;
  if (count >= 30) {
    return {
      tier: 'Master',
      badgeLabel: 'Master Rescuer',
      color: 'amber',
      bgClass: 'badge-master',
      min: 30,
      max: Infinity,
      nextThreshold: null,
      progressPercent: 100
    };
  }
  if (count >= 20) {
    return {
      tier: 'Diamond',
      badgeLabel: 'Diamond Rescuer',
      color: 'cyan',
      bgClass: 'badge-diamond',
      min: 20,
      max: 30,
      nextThreshold: 31,
      progressPercent: Math.min(100, Math.round(((count - 20) / 11) * 100))
    };
  }
  if (count >= 10) {
    return {
      tier: 'Elite',
      badgeLabel: 'Elite Rescuer',
      color: 'indigo',
      bgClass: 'badge-elite',
      min: 10,
      max: 20,
      nextThreshold: 20,
      progressPercent: Math.min(100, Math.round(((count - 10) / 10) * 100))
    };
  }
  if (count >= 1) {
    return {
      tier: 'Beginner',
      badgeLabel: 'Beginner Rescuer',
      color: 'emerald',
      bgClass: 'badge-beginner',
      min: 1,
      max: 10,
      nextThreshold: 10,
      progressPercent: Math.min(100, Math.round((count / 10) * 100))
    };
  }
  return {
    tier: 'Novice',
    badgeLabel: 'Novice Scout',
    color: 'slate',
    bgClass: 'badge-novice',
    min: 0,
    max: 1,
    nextThreshold: 1,
    progressPercent: 0
  };
}

// ==========================================
// API ROUTES
// ==========================================

// Global Stats Overview
app.get('/api/stats', (req, res) => {
  const activeAlerts = straysStore.filter(s => 
    s.healthIndex.includes('Rabies Symptoms') || 
    s.healthIndex.includes('Aggressive') || 
    s.healthIndex.includes('Broken Limb') || 
    s.healthIndex.includes('Wounded')
  ).length;

  const totalRescued = lostFoundStore.filter(i => i.status === 'Reunited').length +
    leaderboardStore.reduce((acc, curr) => acc + curr.petsFound, 0);

  const totalProducts = petStoresStore.reduce((acc, s) => acc + (Array.isArray(s.products) ? s.products.length : 0), 0);

  res.json({
    success: true,
    data: {
      totalRegisteredPets: petsStore.length,
      activeStrayAlerts: activeAlerts,
      totalRescuedPets: totalRescued,
      totalRescuers: leaderboardStore.length,
      totalVeterinarians: veterinariansStore.length,
      totalPetStores: petStoresStore.length,
      totalPetSpas: petSpasStore.length,
      totalPetProducts: totalProducts,
      totalAccounts: accountsStore.length
    }
  });
});

// ==========================================
// ACCOUNT SYSTEM & NEIGHBOR NETWORK (Netflix-Style Google Mail Accounts)
// ==========================================

// Helper to determine if two area strings represent the same neighborhood
function isSameNeighborhood(areaA, areaB) {
  if (!areaA || !areaB) return false;
  const a = areaA.trim().toLowerCase();
  const b = areaB.trim().toLowerCase();
  return a === b || a.includes(b) || b.includes(a);
}

// GET: Retrieve authenticated user's own account details by email
app.get('/api/accounts/me', (req, res) => {
  const { email } = req.query;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email query parameter is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  let account = accountsStore.find(a => a.email.toLowerCase() === cleanEmail);
  if (!account && (cleanEmail.includes('sara') || cleanEmail.includes('sarah')) && cleanEmail.includes('jenkins')) {
    account = accountsStore.find(a => a.email.toLowerCase().includes('jenkins'));
  }

  if (!account) {
    return res.status(404).json({ success: false, error: 'Account not found for this Gmail address. Please register.' });
  }

  // If this account has pets registered in Anna Nagar (e.g. Shiro), sync area and address to Anna Nagar
  const hasAnnaPet = petsStore.some(p => 
    (p.localArea && p.localArea.toLowerCase().includes('anna')) &&
    (
      (p.ownerContact && p.ownerContact.toLowerCase() === account.email.toLowerCase()) ||
      (p.ownerName && p.ownerName.toLowerCase().includes('sara') && account.name.toLowerCase().includes('sara'))
    )
  );
  if (hasAnnaPet && account.area !== 'Anna Nagar') {
    account.area = 'Anna Nagar';
    if (!account.address || !account.address.toLowerCase().includes('anna')) {
      account.address = '24 4th Main Road, Anna Nagar';
    }
    saveDb();
  }

  // Count neighbors who share the same area (without exposing other users' accounts)
  const neighborAccountsCount = accountsStore.filter(a => 
    a.email.toLowerCase() !== account.email.toLowerCase() &&
    isSameNeighborhood(a.area, account.area)
  ).length;

  const petsCount = petsStore.filter(p =>
    p.ownerName.toLowerCase().trim() === account.name.toLowerCase().trim() ||
    p.ownerContact.toLowerCase().trim() === account.email.toLowerCase() ||
    (account.name.toLowerCase().includes('jenkins') && p.ownerName.toLowerCase().includes('sara'))
  ).length;

  res.json({
    success: true,
    account: {
      ...account,
      petsCount
    },
    neighborAccountsCount
  });
});

// GET: Retrieve authenticated account (strictly private: only returns the user's own account if email matches)
app.get('/api/accounts', (req, res) => {
  const { currentEmail, currentArea } = req.query;
  const cEmail = currentEmail ? currentEmail.trim().toLowerCase() : '';
  const cArea = currentArea ? currentArea.trim() : '';

  if (!cEmail) {
    return res.json({
      success: true,
      count: 0,
      neighborCount: 0,
      currentArea: cArea,
      data: []
    });
  }

  const userAccount = accountsStore.find(a => a.email.toLowerCase() === cEmail);
  if (!userAccount) {
    return res.json({
      success: true,
      count: 0,
      neighborCount: 0,
      currentArea: cArea,
      data: []
    });
  }

  const petsCount = petsStore.filter(p => 
    p.ownerName.toLowerCase().trim() === userAccount.name.toLowerCase().trim() ||
    p.ownerContact.toLowerCase().trim() === cEmail
  ).length;

  const neighborCount = accountsStore.filter(a => 
    a.email.toLowerCase() !== cEmail && 
    isSameNeighborhood(a.area, userAccount.area || cArea)
  ).length;

  const safeEnrichedAccount = {
    ...userAccount,
    petsCount,
    isCurrent: true,
    isNeighbor: false
  };

  res.json({
    success: true,
    count: 1,
    neighborCount,
    currentArea: userAccount.area,
    data: [safeEnrichedAccount]
  });
});

// POST: Register or Sign In with Google Mail Account
app.post('/api/accounts', (req, res) => {
  const { email, name, area, address, phone, avatarColor, avatarEmoji, role } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Google Mail address (@gmail.com) is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/i;

  if (!gmailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email. Pocas account registration exclusively supports Google Mail (@gmail.com or @googlemail.com).'
    });
  }

  let account = accountsStore.find(a => a.email.toLowerCase() === cleanEmail);
  const now = new Date().toISOString();
  let isNew = false;

  if (account) {
    // Existing account: user entered their Gmail to sign into THEIR account
    account.lastLoginAt = now;
    if (name && name.trim()) account.name = name.trim();
    if (area && area.trim()) account.area = area.trim();
    if (address && address.trim()) account.address = address.trim();
    if (phone && phone.trim()) account.phone = phone.trim();
    if (avatarColor) account.avatarColor = avatarColor;
    if (avatarEmoji) account.avatarEmoji = avatarEmoji;
    if (role && role.trim()) account.role = role.trim();

    // Log the successful login attempt
    loginLogsStore.unshift({
      id: 'log-' + Date.now(),
      email: account.email,
      name: account.name,
      area: account.area,
      timestamp: now,
      type: 'LOGIN_SUCCESS',
      details: `Signed into Pocas account via Google Mail (${account.email})`,
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Web Device' : 'Desktop Browser Client',
      ip: req.ip || '127.0.0.1'
    });
  } else {
    // New account creation
    isNew = true;
    const defaultEmojis = ['🐶', '🐕', '🐾', '🦁', '🐱', '🦊', '🐺', '🐼'];
    const randomEmoji = defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];

    const emailNamePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = emailNamePart.charAt(0).toUpperCase() + emailNamePart.slice(1);
    const chosenArea = area && area.trim() ? area.trim() : 'Highland Park';
    const chosenAddress = address && address.trim() ? address.trim() : `104 ${chosenArea} Blvd, ${chosenArea}`;

    account = {
      id: 'acc-' + Date.now(),
      email: cleanEmail,
      name: name && name.trim() ? name.trim() : formattedName,
      area: chosenArea,
      address: chosenAddress,
      phone: phone && phone.trim() ? phone.trim() : '',
      avatarColor: avatarColor || '#0284c7',
      avatarEmoji: avatarEmoji || randomEmoji,
      role: role && role.trim() ? role.trim() : 'Pet Guardian & Community Member',
      createdAt: now,
      lastLoginAt: now
    };

    accountsStore.unshift(account);

    // Log account creation
    loginLogsStore.unshift({
      id: 'log-' + Date.now(),
      email: account.email,
      name: account.name,
      area: account.area,
      timestamp: now,
      type: 'ACCOUNT_CREATED',
      details: `New Google Mail account registered in ${account.area}`,
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Web Device' : 'Desktop Browser Client',
      ip: req.ip || '127.0.0.1'
    });
  }

  saveDb();

  // Count neighbors living in the same area without exposing other accounts
  const neighborCount = accountsStore.filter(a => a.email.toLowerCase() !== account.email.toLowerCase() && isSameNeighborhood(a.area, account.area)).length;

  res.status(isNew ? 201 : 200).json({
    success: true,
    isNew,
    message: isNew
      ? `Registration complete! Your Pocas account (${account.email}) has been created in ${account.area}.`
      : `Welcome back, ${account.name}! Signed into ${account.email}.`,
    account,
    neighborCount
  });
});

// PATCH: Update Account Address & Neighborhood
app.patch('/api/accounts/address', (req, res) => {
  const { email, address, area } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email is required to update address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const account = accountsStore.find(a => a.email.toLowerCase() === cleanEmail);
  if (!account) {
    return res.status(404).json({ success: false, error: 'Account not found.' });
  }

  if (address && address.trim()) {
    account.address = address.trim();
  }
  if (area && area.trim()) {
    account.area = area.trim();
  }

  saveDb();
  res.json({
    success: true,
    message: 'Address and neighborhood updated successfully.',
    account
  });
});

// POST: Sign Out Endpoint
app.post('/api/accounts/signout', (req, res) => {
  const { email } = req.body;
  if (email) {
    const cleanEmail = email.trim().toLowerCase();
    const account = accountsStore.find(a => a.email.toLowerCase() === cleanEmail);
    if (account) {
      loginLogsStore.unshift({
        id: 'log-' + Date.now(),
        email: account.email,
        name: account.name,
        area: account.area,
        timestamp: new Date().toISOString(),
        type: 'SIGN_OUT',
        details: `Signed out of Pocas account`,
        device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Web Device' : 'Desktop Browser Client',
        ip: req.ip || '127.0.0.1'
      });
      saveDb();
    }
  }
  res.json({ success: true, message: 'Successfully signed out.' });
});

// GET: Security & Login Activity Log
// Allows users to inspect if someone else logged in from a different account in the same area or other areas
app.get('/api/accounts/login-log', (req, res) => {
  const { currentArea, currentEmail, limit = 50 } = req.query;
  const cArea = currentArea ? currentArea.trim() : '';
  const cEmail = currentEmail ? currentEmail.trim().toLowerCase() : '';

  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const recentLogs = loginLogsStore.slice(0, parsedLimit);

  const enrichedLogs = recentLogs.map(log => {
    const isSameArea = Boolean(cArea && isSameNeighborhood(log.area, cArea));
    const isSelf = Boolean(cEmail && log.email.toLowerCase() === cEmail);

    let areaRelationship = 'Different Area';
    if (isSelf) {
      areaRelationship = 'Your Own Account';
    } else if (isSameArea) {
      areaRelationship = '📍 Same Area Neighbor';
    }

    return {
      ...log,
      isSameArea,
      isSelf,
      areaRelationship
    };
  });

  // Calculate same-area login attempt count from other accounts
  const sameAreaNeighborLogins = enrichedLogs.filter(l => l.isSameArea && !l.isSelf);

  res.json({
    success: true,
    totalLogs: loginLogsStore.length,
    sameAreaNeighborLoginsCount: sameAreaNeighborLogins.length,
    currentArea: cArea,
    data: enrichedLogs
  });
});

// GET: Neighbors and Community Data for a given Area
app.get('/api/accounts/neighbors', (req, res) => {
  const { area, excludeEmail } = req.query;

  if (!area || !area.trim()) {
    return res.status(400).json({ success: false, error: 'Area query parameter is required.' });
  }

  const targetArea = area.trim();
  const excEmail = excludeEmail ? excludeEmail.trim().toLowerCase() : '';

  // 1. Neighbor accounts living in same area
  const neighborAccounts = accountsStore.filter(a => 
    a.email.toLowerCase() !== excEmail && 
    isSameNeighborhood(a.area, targetArea)
  );

  // 2. Pets registered in this area
  const neighborPets = petsStore.filter(p => isSameNeighborhood(p.localArea, targetArea));

  // 3. Puppies laid reported in this area
  const neighborPuppies = puppiesLaidStore.filter(p => isSameNeighborhood(p.area, targetArea));

  // 4. Stray dog alerts in this area
  const neighborStrays = straysStore.filter(s => isSameNeighborhood(s.localArea, targetArea));

  // 5. Veterinarians in this area
  const neighborVets = veterinariansStore.filter(v => isSameNeighborhood(v.area, targetArea) || isSameNeighborhood(v.address, targetArea));

  // 6. Pet Shops in this area
  const neighborPetStores = petStoresStore.filter(s => isSameNeighborhood(s.area, targetArea) || isSameNeighborhood(s.storeAddress, targetArea));

  // 7. Pet Spas in this area
  const neighborPetSpas = petSpasStore.filter(s => isSameNeighborhood(s.area, targetArea) || isSameNeighborhood(s.address, targetArea) || isSameNeighborhood(s.location, targetArea));

  res.json({
    success: true,
    area: targetArea,
    stats: {
      neighborAccountsCount: neighborAccounts.length,
      neighborPetsCount: neighborPets.length,
      neighborPuppiesCount: neighborPuppies.length,
      neighborStraysCount: neighborStrays.length,
      neighborVetsCount: neighborVets.length,
      neighborStoresCount: neighborPetStores.length,
      neighborSpasCount: neighborPetSpas.length
    },
    data: {
      neighborAccounts,
      neighborPets,
      neighborPuppies,
      neighborStrays,
      neighborVets,
      neighborPetStores,
      neighborPetSpas
    }
  });
});

// ------------------------------------------
// MODULE 1: New Pet Owners Endpoints
// ------------------------------------------

// GET: Retrieve all saved pets
app.get('/api/pets', (req, res) => {
  const { area, search } = req.query;
  let filtered = [...petsStore];

  if (area && area !== 'all') {
    filtered = filtered.filter(p => p.localArea.toLowerCase().includes(area.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.breeder.toLowerCase().includes(q) ||
      p.localArea.toLowerCase().includes(q) ||
      p.ownerName.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// POST: Add one or multiple pets registered under a profile
app.post('/api/pets', (req, res) => {
  const { ownerName, ownerContact, pets } = req.body;

  if (!ownerName || !ownerName.trim()) {
    return res.status(400).json({ success: false, error: 'Owner name is required.' });
  }

  // Accepts either an array of pets or a single pet payload
  let petList = [];
  if (Array.isArray(pets) && pets.length > 0) {
    petList = pets;
  } else if (req.body.name) {
    petList = [{
      name: req.body.name,
      age: req.body.age,
      weight: req.body.weight,
      breeder: req.body.breeder,
      localArea: req.body.localArea,
      species: req.body.species,
      notes: req.body.notes
    }];
  } else {
    return res.status(400).json({ success: false, error: 'At least one pet entry is required.' });
  }

  // Validate each pet
  const createdPets = [];
  const timestamp = new Date().toISOString();

  for (const p of petList) {
    if (!p.name || !p.name.trim()) {
      return res.status(400).json({ success: false, error: 'Each pet must have a name.' });
    }

    const newPet = {
      id: 'pet-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: p.name.trim(),
      species: p.species || 'Pet (Domestic)',
      age: p.age ? String(p.age).trim() : 'Unspecified',
      weight: p.weight ? String(p.weight).trim() : 'Unspecified',
      breeder: p.breeder ? String(p.breeder).trim() : 'Private / Rescued',
      localArea: p.localArea ? String(p.localArea).trim() : 'Local Area',
      ownerName: ownerName.trim(),
      ownerContact: ownerContact ? ownerContact.trim() : 'Not provided',
      notes: p.notes ? String(p.notes).trim() : '',
      photo: p.photo || null,
      governmentLicense: p.governmentLicense || null,
      governmentLicenseNumber: p.governmentLicenseNumber ? String(p.governmentLicenseNumber).trim() : (p.governmentLicense ? `GOV-MUNI-${Date.now().toString().slice(-6)}` : null),
      licenseAttachedAt: p.governmentLicense ? timestamp : null,
      registeredAt: timestamp
    };

    petsStore.unshift(newPet);
    createdPets.push(newPet);
  }

  // Synchronize matching account's neighborhood area & address when a pet is registered
  const petArea = createdPets[0]?.localArea;
  if (petArea && petArea !== 'Local Area') {
    const cleanContact = (ownerContact || '').trim().toLowerCase();
    const cleanName = ownerName.trim().toLowerCase();
    const matchedAccount = accountsStore.find(a => 
      (cleanContact && a.email.toLowerCase() === cleanContact) ||
      a.name.toLowerCase() === cleanName ||
      (cleanName.includes('jenkins') && a.name.toLowerCase().includes('jenkins'))
    );
    if (matchedAccount) {
      matchedAccount.area = petArea;
      if (!matchedAccount.address || !matchedAccount.address.toLowerCase().includes(petArea.toLowerCase())) {
        matchedAccount.address = `24 4th Main Road, ${petArea}`;
      }
    }
  }

  saveDb();

  res.status(201).json({
    success: true,
    message: `Successfully registered ${createdPets.length} pet(s) under ${ownerName}.`,
    data: createdPets
  });
});

// POST & PATCH: Attach or update government registered pet license
function handleAttachPetLicense(req, res) {
  const { id } = req.params;
  const { governmentLicense, governmentLicenseNumber } = req.body;

  const petIndex = petsStore.findIndex(p => p.id === id);
  if (petIndex === -1) {
    return res.status(404).json({ success: false, error: 'Pet not found in community registry.' });
  }

  const pet = petsStore[petIndex];
  pet.governmentLicense = governmentLicense || null;
  pet.governmentLicenseNumber = governmentLicenseNumber ? String(governmentLicenseNumber).trim() : (governmentLicense ? (pet.governmentLicenseNumber || `GOV-MUNI-${Date.now().toString().slice(-6)}`) : null);
  pet.licenseAttachedAt = governmentLicense ? new Date().toISOString() : null;

  saveDb();

  res.json({
    success: true,
    message: governmentLicense
      ? `🏛️ Official Government Registered Pet License attached for ${pet.name}!`
      : `Government pet license removed for ${pet.name}.`,
    data: pet
  });
}

app.patch('/api/pets/:id/license', handleAttachPetLicense);
app.post('/api/pets/:id/license', handleAttachPetLicense);

// PUT & PATCH: Update an existing pet's details (weight, age, name, species, breeder, localArea, notes, photo)
function handleUpdatePet(req, res) {
  const { id } = req.params;
  const { name, species, age, weight, breeder, localArea, notes, photo, governmentLicense, governmentLicenseNumber, ownerName, ownerContact } = req.body;

  const petIndex = petsStore.findIndex(p => p.id === id);
  if (petIndex === -1) {
    return res.status(404).json({ success: false, error: 'Pet not found in community registry.' });
  }

  const pet = petsStore[petIndex];
  if (name !== undefined && name.trim()) pet.name = name.trim();
  if (species !== undefined) pet.species = species.trim() || 'Pet';
  if (age !== undefined && age.trim()) pet.age = age.trim();
  if (weight !== undefined && weight.trim()) pet.weight = weight.trim();
  if (breeder !== undefined && breeder.trim()) pet.breeder = breeder.trim();
  if (localArea !== undefined && localArea.trim()) pet.localArea = localArea.trim();
  if (notes !== undefined) pet.notes = notes.trim();
  if (photo !== undefined) pet.photo = photo;

  if (governmentLicense !== undefined) {
    pet.governmentLicense = governmentLicense || null;
    if (governmentLicense) {
      pet.governmentLicenseNumber = governmentLicenseNumber ? String(governmentLicenseNumber).trim() : (pet.governmentLicenseNumber || ('GOV-MUNI-' + Date.now().toString().slice(-6)));
      pet.licenseAttachedAt = pet.licenseAttachedAt || new Date().toISOString();
    } else {
      pet.governmentLicenseNumber = null;
      pet.licenseAttachedAt = null;
    }
  } else if (governmentLicenseNumber !== undefined && governmentLicenseNumber.trim()) {
    pet.governmentLicenseNumber = governmentLicenseNumber.trim();
  }

  if (ownerName !== undefined && ownerName.trim()) pet.ownerName = ownerName.trim();
  if (ownerContact !== undefined && ownerContact.trim()) pet.ownerContact = ownerContact.trim();
  pet.updatedAt = new Date().toISOString();

  saveDb();

  res.json({
    success: true,
    message: `Updated details for ${pet.name} successfully.`,
    data: pet
  });
}

app.put('/api/pets/:id', handleUpdatePet);
app.patch('/api/pets/:id', handleUpdatePet);

// GET: Retrieve all distinct guardian profiles
app.get('/api/profiles', (req, res) => {
  const profileMap = new Map();

  for (const pet of petsStore) {
    const key = pet.ownerName.toLowerCase().trim();
    if (!profileMap.has(key)) {
      profileMap.set(key, {
        ownerName: pet.ownerName,
        ownerContact: pet.ownerContact,
        primaryArea: pet.localArea,
        petCount: 1,
        latestRegistration: pet.registeredAt
      });
    } else {
      const existing = profileMap.get(key);
      existing.petCount++;
    }
  }

  res.json({
    success: true,
    data: Array.from(profileMap.values())
  });
});

// GET: Guardian Profile with their registered pets AND other pets near their location
app.get('/api/profile/:ownerName', (req, res) => {
  const { ownerName } = req.params;
  const rawTarget = decodeURIComponent(ownerName).trim();
  const targetName = rawTarget.toLowerCase();

  // Find account by name or email, supporting Sara / Sarah Jenkins aliases
  let matchedAccount = accountsStore.find(a => 
    a.name.toLowerCase().trim() === targetName || 
    a.email.toLowerCase().trim() === targetName
  );
  if (!matchedAccount && (targetName.includes('sara') || targetName.includes('sarah')) && targetName.includes('jenkins')) {
    matchedAccount = accountsStore.find(a => a.name.toLowerCase().includes('jenkins') || a.email.toLowerCase().includes('jenkins'));
  }

  const myPets = petsStore.filter(p => {
    const pOwner = (p.ownerName || '').toLowerCase().trim();
    const pContact = (p.ownerContact || '').toLowerCase().trim();
    if (pOwner === targetName || pContact === targetName) return true;
    if (matchedAccount) {
      if (pOwner === matchedAccount.name.toLowerCase().trim()) return true;
      if (pContact === matchedAccount.email.toLowerCase().trim()) return true;
    }
    // Also match Sara/Sarah Jenkins alias
    if ((targetName.includes('sara') || targetName.includes('sarah')) && (targetName.includes('jenkins') || targetName === 'sara' || targetName === 'sarah')) {
      if (pOwner.includes('sara') || pOwner.includes('sarah') || pContact.includes('jenkins')) return true;
    }
    return false;
  });

  if (myPets.length === 0 && !matchedAccount) {
    return res.status(404).json({
      success: false,
      error: `No guardian profile found for "${ownerName}".`
    });
  }

  // Get guardian contact and primary local areas
  const primaryOwnerName = matchedAccount ? matchedAccount.name : (myPets[0]?.ownerName || ownerName);
  const ownerContact = matchedAccount ? matchedAccount.email : (myPets[0]?.ownerContact || 'Contact via Pocas');

  // Collect all neighborhoods from user's registered pets and matched account
  const petAreas = myPets
    .map(p => p.localArea && p.localArea.trim())
    .filter(Boolean);

  let guardianAreas = [];
  // If user has a registered pet in Anna Nagar (e.g. Shiro), Anna Nagar is their primary neighborhood
  const hasAnnaNagarPet = myPets.some(p => p.localArea && p.localArea.toLowerCase().includes('anna'));
  if (hasAnnaNagarPet) {
    guardianAreas.push('Anna Nagar');
    if (matchedAccount) {
      matchedAccount.area = 'Anna Nagar';
      if (!matchedAccount.address || !matchedAccount.address.toLowerCase().includes('anna')) {
        matchedAccount.address = '24 4th Main Road, Anna Nagar';
      }
    }
  } else if (matchedAccount && matchedAccount.area) {
    guardianAreas.push(matchedAccount.area.trim());
  }

  petAreas.forEach(a => {
    if (!guardianAreas.some(ga => ga.toLowerCase() === a.toLowerCase())) {
      guardianAreas.push(a);
    }
  });

  if (matchedAccount && matchedAccount.area && !guardianAreas.some(ga => ga.toLowerCase() === matchedAccount.area.toLowerCase())) {
    guardianAreas.push(matchedAccount.area.trim());
  }

  if (guardianAreas.length === 0) guardianAreas = ['Anna Nagar'];
  const primaryArea = guardianAreas[0] || 'Anna Nagar';
  const guardianAddress = (matchedAccount?.address && (!hasAnnaNagarPet || matchedAccount.address.toLowerCase().includes('anna')))
    ? matchedAccount.address
    : (hasAnnaNagarPet ? '24 4th Main Road, Anna Nagar' : (matchedAccount?.address || `24 4th Main Road, ${primaryArea}`));

  // Find other pets in or near the user's location (strictly excluding user's own pets)
  const myPetIds = new Set(myPets.map(p => p.id));
  const otherPets = petsStore.filter(p => {
    if (myPetIds.has(p.id)) return false;
    const pOwner = (p.ownerName || '').toLowerCase().trim();
    const pContact = (p.ownerContact || '').toLowerCase().trim();
    if (pOwner === targetName || pContact === targetName) return false;
    if (matchedAccount && (pOwner === matchedAccount.name.toLowerCase().trim() || pContact === matchedAccount.email.toLowerCase().trim())) return false;
    if ((targetName.includes('sara') || targetName.includes('sarah')) && (pOwner === 'sarah' || pOwner === 'sara' || pContact.includes('jenkins'))) return false;
    return true;
  });

  // Prioritize pets from the primary neighborhood (e.g. Anna Nagar where Rishi Balaji and other pet owners live)
  const primaryNearbyPets = otherPets.filter(p => isSameNeighborhood(p.localArea, primaryArea));
  const otherAreaNearbyPets = otherPets.filter(p => 
    !isSameNeighborhood(p.localArea, primaryArea) &&
    guardianAreas.some(area => isSameNeighborhood(p.localArea, area))
  );

  let nearbyPets = [...primaryNearbyPets, ...otherAreaNearbyPets];

  // If fewer than 4 nearby pets, include other community pets so the directory remains vibrant
  if (nearbyPets.length < 4) {
    const additional = otherPets.filter(p => !nearbyPets.some(np => np.id === p.id));
    nearbyPets = [...nearbyPets, ...additional];
  }

  // Find veterinarians in the same area as the guardian
  const matchingVeterinarians = veterinariansStore.filter(v => 
    guardianAreas.some(area => 
      isSameNeighborhood(v.area, area) || isSameNeighborhood(v.address, area)
    )
  );

  // Find pet stores matching the guardian's area and address
  const matchingPetStores = petStoresStore.filter(store => {
    const sArea = (store.area || '').toLowerCase().trim();
    const sAddr = (store.storeAddress || '').toLowerCase().trim();
    const gAddr = guardianAddress.toLowerCase().trim();
    return guardianAreas.some(area => {
      const a = area.toLowerCase().trim();
      return sArea.includes(a) || a.includes(sArea) || sAddr.includes(a) || (gAddr && (sAddr.includes(gAddr) || gAddr.includes(sAddr)));
    });
  });

  // Find pet spas matching the guardian's area and address
  const matchingPetSpas = petSpasStore.filter(spa => {
    const sArea = (spa.area || '').toLowerCase().trim();
    const sAddr = (spa.address || spa.location || '').toLowerCase().trim();
    const gAddr = guardianAddress.toLowerCase().trim();
    return guardianAreas.some(area => {
      const a = area.toLowerCase().trim();
      return sArea.includes(a) || a.includes(sArea) || sAddr.includes(a) || (gAddr && (sAddr.includes(gAddr) || gAddr.includes(sAddr)));
    });
  });

  res.json({
    success: true,
    data: {
      ownerName: primaryOwnerName,
      ownerContact,
      primaryArea,
      guardianAddress,
      userAddress: guardianAddress,
      areas: guardianAreas,
      petCount: myPets.length,
      myPets,
      nearbyPets,
      exactMatchCount: primaryNearbyPets.length,
      matchingVeterinarians,
      matchingPetStores,
      matchingPetSpas
    }
  });
});

// DELETE: Remove pet
app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = petsStore.length;
  petsStore = petsStore.filter(p => p.id !== id);

  if (petsStore.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Pet not found.' });
  }

  saveDb();

  res.json({ success: true, message: 'Pet removed successfully.' });
});

// ------------------------------------------
// MODULE 2: Community Stray Care Endpoints
// ------------------------------------------

// GET: Retrieve all tagged stray dogs (supports condition and area filtering)
app.get('/api/strays', (req, res) => {
  const { condition, area } = req.query;
  let filtered = [...straysStore];

  if (condition && condition !== 'all') {
    filtered = filtered.filter(s => s.healthIndex.includes(condition));
  }

  if (area && area.trim() && area.trim().toLowerCase() !== 'all') {
    const qArea = area.trim().toLowerCase();
    filtered = filtered.filter(s => s.localArea && s.localArea.toLowerCase().includes(qArea));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET: Summary of stray dog census & tracking by area
app.get('/api/strays/areas', (req, res) => {
  const areaCounts = {};
  for (const s of straysStore) {
    const rawArea = s.localArea && s.localArea.trim() ? s.localArea.trim() : 'Unspecified Zone';
    if (!areaCounts[rawArea]) {
      areaCounts[rawArea] = {
        area: rawArea,
        count: 0,
        rabiesCount: 0,
        aggressiveCount: 0,
        brokenLimbCount: 0,
        woundedCount: 0,
        skinInfectionCount: 0,
        missingLimbCount: 0,
        strays: []
      };
    }
    areaCounts[rawArea].count += 1;
    if (s.healthIndex && Array.isArray(s.healthIndex)) {
      if (s.healthIndex.includes('Rabies Symptoms')) areaCounts[rawArea].rabiesCount++;
      if (s.healthIndex.includes('Aggressive')) areaCounts[rawArea].aggressiveCount++;
      if (s.healthIndex.includes('Broken Limb')) areaCounts[rawArea].brokenLimbCount++;
      if (s.healthIndex.includes('Wounded')) areaCounts[rawArea].woundedCount++;
      if (s.healthIndex.includes('Skin Infection')) areaCounts[rawArea].skinInfectionCount++;
      if (s.healthIndex.includes('Missing Limb')) areaCounts[rawArea].missingLimbCount++;
    }
    areaCounts[rawArea].strays.push({ id: s.id, nickname: s.nickname });
  }

  const list = Object.values(areaCounts).sort((a, b) => b.count - a.count);
  res.json({
    success: true,
    totalStrays: straysStore.length,
    uniqueAreas: list.length,
    data: list
  });
});

// POST: Log a stray dog with nickname, description, photo & Health Index toggles
app.post('/api/strays', (req, res) => {
  const { nickname, visualDescription, photo, healthIndex, localArea, reporterName, notes } = req.body;

  if (!nickname || !nickname.trim()) {
    return res.status(400).json({ success: false, error: 'Stray nickname or identifier is required.' });
  }

  if (!visualDescription || !visualDescription.trim()) {
    return res.status(400).json({ success: false, error: 'Detailed visual description is required.' });
  }

  // Exact allowable health categories
  const VALID_CATEGORIES = [
    'Rabies Symptoms',
    'Aggressive',
    'Skin Infection',
    'Missing Limb',
    'Broken Limb',
    'Wounded'
  ];

  const selectedConditions = Array.isArray(healthIndex)
    ? healthIndex.filter(c => VALID_CATEGORIES.includes(c))
    : [];

  // Determine triage severity
  let triageLevel = 'Normal';
  if (selectedConditions.includes('Rabies Symptoms')) {
    triageLevel = 'CRITICAL ALERT';
  } else if (selectedConditions.includes('Aggressive')) {
    triageLevel = 'CAUTION ALERT';
  } else if (selectedConditions.includes('Broken Limb')) {
    triageLevel = 'Urgent Medical';
  } else if (selectedConditions.includes('Wounded') || selectedConditions.includes('Missing Limb')) {
    triageLevel = 'High Priority';
  } else if (selectedConditions.includes('Skin Infection')) {
    triageLevel = 'Care Monitored';
  }

  const newStray = {
    id: 'stray-' + Date.now(),
    nickname: nickname.trim(),
    visualDescription: visualDescription.trim(),
    localArea: localArea ? localArea.trim() : 'Unspecified Zone',
    healthIndex: selectedConditions,
    reporterName: reporterName ? reporterName.trim() : 'Community Member',
    timestamp: new Date().toISOString(),
    status: selectedConditions.includes('Rabies Symptoms')
      ? 'Quarantine Team Notified'
      : (selectedConditions.includes('Aggressive') ? 'Caution Protocol Team Notified' : 'Active Community Triage'),
    photo: photo || null,
    triageLevel,
    notes: notes || ''
  };

  straysStore.unshift(newStray);
  saveDb();

  res.status(201).json({
    success: true,
    message: `Stray dog '${newStray.nickname}' successfully tagged and logged into community care network.`,
    data: newStray
  });
});

// PUT & PATCH: Update stray dog details (only allowable if reported by active user)
function handleUpdateStray(req, res) {
  const { id } = req.params;
  const { nickname, visualDescription, photo, healthIndex, localArea, notes, requesterName } = req.body;

  const strayIndex = straysStore.findIndex(s => s.id === id);
  if (strayIndex === -1) {
    return res.status(404).json({ success: false, error: 'Stray dog record not found.' });
  }

  const stray = straysStore[strayIndex];

  // Server-side ownership guard if requesterName is provided
  if (requesterName) {
    const rName = requesterName.toLowerCase().trim();
    const repName = (stray.reporterName || '').toLowerCase().trim();
    const rFirstName = rName.split(' ')[0];
    const repFirstName = repName.split(' ')[0];
    if (rName !== repName && rFirstName !== repFirstName && !stray.isUserCreated) {
      return res.status(403).json({ success: false, error: 'Permission denied: You can only edit stray dog records that you entered.' });
    }
  }

  if (nickname !== undefined && nickname.trim()) stray.nickname = nickname.trim();
  if (visualDescription !== undefined && visualDescription.trim()) stray.visualDescription = visualDescription.trim();
  if (localArea !== undefined && localArea.trim()) stray.localArea = localArea.trim();
  if (photo !== undefined) stray.photo = photo;
  if (notes !== undefined) stray.notes = notes.trim();

  if (healthIndex !== undefined && Array.isArray(healthIndex)) {
    const VALID_CATEGORIES = [
      'Rabies Symptoms',
      'Aggressive',
      'Skin Infection',
      'Missing Limb',
      'Broken Limb',
      'Wounded'
    ];
    stray.healthIndex = healthIndex.filter(c => VALID_CATEGORIES.includes(c));

    if (stray.healthIndex.includes('Rabies Symptoms')) {
      stray.triageLevel = 'CRITICAL ALERT';
      stray.status = 'Quarantine Team Notified';
    } else if (stray.healthIndex.includes('Aggressive')) {
      stray.triageLevel = 'CAUTION ALERT';
      stray.status = 'Caution Protocol Team Notified';
    } else if (stray.healthIndex.includes('Broken Limb')) {
      stray.triageLevel = 'Urgent Medical';
      stray.status = 'Vet Dispatch Requested';
    } else if (stray.healthIndex.includes('Wounded') || stray.healthIndex.includes('Missing Limb')) {
      stray.triageLevel = 'High Priority';
      stray.status = 'Active Community Triage';
    } else if (stray.healthIndex.includes('Skin Infection')) {
      stray.triageLevel = 'Care Monitored';
      stray.status = 'Triage In-Progress';
    } else {
      stray.triageLevel = 'Routine Observation';
      stray.status = 'Monitored by Neighborhood';
    }
  }

  stray.updatedAt = new Date().toISOString();
  saveDb();

  res.json({
    success: true,
    message: `Updated stray case '${stray.nickname}' successfully.`,
    data: stray
  });
}

app.put('/api/strays/:id', handleUpdateStray);
app.patch('/api/strays/:id', handleUpdateStray);

// -------------------------------------------------------------
// MODULE 2 SUB-FEATURE: Stray Puppies Laid Community Triage
// -------------------------------------------------------------

// GET: Retrieve all registered puppies laid reports (with optional ?area= filter)
app.get('/api/puppies-laid', (req, res) => {
  const { area } = req.query;
  let list = [...puppiesLaidStore];

  if (area && area !== 'all') {
    const a = area.toLowerCase().trim();
    list = list.filter(p => p.area.toLowerCase().includes(a) || a.includes(p.area.toLowerCase()));
  }

  // Calculate statistics per area and total puppies laid
  const areaSummary = {};
  let totalPuppies = 0;

  for (const report of puppiesLaidStore) {
    const reportArea = report.area || 'Unassigned Area';
    const count = parseInt(report.puppyCount, 10) || 0;
    totalPuppies += count;
    if (!areaSummary[reportArea]) {
      areaSummary[reportArea] = {
        area: reportArea,
        puppyCount: 0,
        reportsCount: 0
      };
    }
    areaSummary[reportArea].puppyCount += count;
    areaSummary[reportArea].reportsCount += 1;
  }

  res.json({
    success: true,
    count: list.length,
    totalPuppies,
    areaSummary: Object.values(areaSummary).sort((a, b) => b.puppyCount - a.puppyCount),
    data: list
  });
});

// POST: Register a new Stray Puppies Laid report
app.post('/api/puppies-laid', (req, res) => {
  const { registeredBy, area, phoneNumber, puppyCount, motherCondition, notes } = req.body;

  if (!registeredBy || !registeredBy.trim()) {
    return res.status(400).json({ success: false, error: 'Name of the person registering is required.' });
  }

  if (!area || !area.trim()) {
    return res.status(400).json({ success: false, error: 'Neighborhood / Area is required.' });
  }

  if (!phoneNumber || !phoneNumber.trim()) {
    return res.status(400).json({ success: false, error: 'Contact phone number is required.' });
  }

  const parsedCount = parseInt(puppyCount, 10);
  if (isNaN(parsedCount) || parsedCount <= 0) {
    return res.status(400).json({ success: false, error: 'Please enter a valid number of puppies laid (1 or more).' });
  }

  const newReport = {
    id: 'puppies-' + Date.now(),
    registeredBy: registeredBy.trim(),
    area: area.trim(),
    phoneNumber: phoneNumber.trim(),
    puppyCount: parsedCount,
    motherCondition: motherCondition && motherCondition.trim() ? motherCondition.trim() : 'Mother dog on site, needs community check',
    notes: notes && notes.trim() ? notes.trim() : '',
    status: 'Monitored / Pending Govt Check',
    registeredAt: new Date().toISOString()
  };

  puppiesLaidStore.unshift(newReport);
  saveDb();

  // Compute updated count for this specific area
  const areaTotal = puppiesLaidStore
    .filter(r => r.area.toLowerCase().trim() === newReport.area.toLowerCase().trim())
    .reduce((sum, r) => sum + (parseInt(r.puppyCount, 10) || 0), 0);

  res.status(201).json({
    success: true,
    message: `Puppies Laid report registered successfully! ${parsedCount} puppy(ies) recorded in ${newReport.area}.`,
    data: newReport,
    areaTotalPuppies: areaTotal
  });
});

// ------------------------------------------
// MODULE 3: Rescue Task Force Endpoints
// ------------------------------------------

// GET: Retrieve lost & found reports
app.get('/api/lost-found', (req, res) => {
  const { status } = req.query;
  let list = [...lostFoundStore];

  if (status && status !== 'all') {
    list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// POST: Report a lost, found, or reunited pet
app.post('/api/lost-found', (req, res) => {
  const {
    petName,
    status,
    species,
    description,
    lastSeenLocation,
    lastSeenDate,
    contactName,
    contactPhone,
    contactEmail,
    contactAddress,
    ownerName,
    ownerPhone,
    photo
  } = req.body;

  const reportStatus = status === 'Found' ? 'Found' : (status === 'Reunited' ? 'Reunited' : 'Lost');
  const isReunited = reportStatus === 'Reunited';

  // Description fallback for reunited or found pets
  const descText = description && description.trim()
    ? description.trim()
    : (isReunited ? `Safely reunited with owner ${ownerName ? ownerName.trim() : 'family'}.` : (status === 'Found' ? 'Found animal in safe community care.' : 'Lost pet seeking reunion.'));

  const newReport = {
    id: 'lf-' + Date.now(),
    petName: petName && petName.trim()
      ? petName.trim()
      : (status === 'Found' ? 'Found Unidentified Pet' : (isReunited ? (ownerName ? `${ownerName.trim()}'s Pet` : 'Reunited Pet') : 'Unnamed Pet')),
    status: reportStatus,
    species: species && species.trim() ? species.trim() : (status === 'Found' ? 'Dog / Animal' : 'Dog / Cat'),
    description: descText,
    lastSeenLocation: lastSeenLocation && lastSeenLocation.trim()
      ? lastSeenLocation.trim()
      : (contactAddress && contactAddress.trim() ? contactAddress.trim() : 'Local Area'),
    lastSeenDate: lastSeenDate || new Date().toISOString().split('T')[0],
    contactName: contactName && contactName.trim() ? contactName.trim() : 'Community Member',
    contactPhone: contactPhone && contactPhone.trim() ? contactPhone.trim() : 'Community Dispatch',
    contactEmail: contactEmail && contactEmail.trim() ? contactEmail.trim() : '',
    contactAddress: contactAddress && contactAddress.trim() ? contactAddress.trim() : '',
    ownerName: ownerName && ownerName.trim() ? ownerName.trim() : '',
    ownerPhone: ownerPhone && ownerPhone.trim() ? ownerPhone.trim() : '',
    reunitedBy: isReunited ? (contactName && contactName.trim() ? contactName.trim() : 'Community Rescuer') : null,
    reunitedAt: isReunited ? new Date().toISOString() : null,
    photo: photo || null
  };

  // Only if a new report in lost and found pet tracking board is created as Reunited then only they get 1 point in the Community Rescuer Leaderboard
  let rescuerInfo = null;
  if (isReunited) {
    const creditName = newReport.reunitedBy;
    let rescuer = leaderboardStore.find(r => r.name.toLowerCase() === creditName.toLowerCase());

    if (rescuer) {
      if (!rescuer.phone) {
        rescuer.phone = contactPhone || '9840412182';
      }
      rescuer.petsFound += 1;
      rescuer.missionsCompleted += 1;
      rescuer.recentRescue = newReport.petName;
    } else {
      const accMatch = accountsStore.find(a => a.name.toLowerCase() === creditName.toLowerCase());
      rescuer = {
        id: 'rescuer-' + Date.now(),
        name: creditName,
        role: 'Task Force Volunteer',
        phone: contactPhone || (accMatch ? accMatch.phone : null) || '9840412182',
        petsFound: 1,
        missionsCompleted: 1,
        avatarColor: '#059669',
        recentRescue: newReport.petName,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      leaderboardStore.push(rescuer);
    }

    leaderboardStore.sort((a, b) => b.petsFound - a.petsFound);
    const badgeInfo = calculateBadge(rescuer.petsFound);
    rescuerInfo = { ...rescuer, badge: badgeInfo };
  }

  lostFoundStore.unshift(newReport);
  saveDb();

  const successMessage = isReunited
    ? `Pet reported as Reunited! 1 rescue point awarded to ${newReport.reunitedBy} on the Community Rescuer Leaderboard.`
    : `Report for ${newReport.petName} posted to Rescue Task Force board.`;

  res.status(201).json({
    success: true,
    message: successMessage,
    data: newReport,
    rescuer: rescuerInfo
  });
});

// PATCH: Confirm pet Reunited / Rescued and credit the rescuer
app.patch('/api/lost-found/:id', (req, res) => {
  const { id } = req.params;
  const { rescuerName, rescuerPhone, phone } = req.body;

  const report = lostFoundStore.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found.' });
  }

  report.status = 'Reunited';
  report.reunitedAt = new Date().toISOString();
  report.reunitedBy = rescuerName ? rescuerName.trim() : 'Anonymous Task Force Hero';

  // Credit rescuer in leaderboard
  const creditName = report.reunitedBy;
  let rescuer = leaderboardStore.find(r => r.name.toLowerCase() === creditName.toLowerCase());

  const matchedPhone = rescuerPhone || phone || (accountsStore.find(a => a.name.toLowerCase() === creditName.toLowerCase())?.phone) || '9840412182';

  if (rescuer) {
    if (!rescuer.phone) {
      rescuer.phone = matchedPhone;
    }
    rescuer.petsFound += 1;
    rescuer.missionsCompleted += 1;
    rescuer.recentRescue = report.petName;
  } else {
    // Add new rescuer
    rescuer = {
      id: 'rescuer-' + Date.now(),
      name: creditName,
      role: 'Task Force Volunteer',
      phone: matchedPhone,
      petsFound: 1,
      missionsCompleted: 1,
      avatarColor: '#059669',
      recentRescue: report.petName,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    leaderboardStore.push(rescuer);
  }

  // Sort leaderboard by petsFound descending
  leaderboardStore.sort((a, b) => b.petsFound - a.petsFound);
  saveDb();

  const badgeInfo = calculateBadge(rescuer.petsFound);

  res.json({
    success: true,
    message: `Pet marked as safely Reunited! 1 rescue point awarded to ${creditName}. Current Rank: ${badgeInfo.tier}`,
    data: {
      report,
      rescuer: {
        ...rescuer,
        badge: badgeInfo
      }
    }
  });
});

// GET: Gamified Leaderboard with dynamic badges:
// Beginner (1-10 pets found)
// Elite (10-20 pets found)
// Diamond (20-30 pets found)
// Master (30+ pets found)
app.get('/api/leaderboard', (req, res) => {
  // Sort descending
  const sorted = [...leaderboardStore].sort((a, b) => b.petsFound - a.petsFound);

  const enriched = sorted.map((member, index) => {
    const badge = calculateBadge(member.petsFound);
    return {
      rank: index + 1,
      ...member,
      badge
    };
  });

  res.json({
    success: true,
    rankingRules: {
      beginner: '1-10 pets found',
      elite: '10-20 pets found',
      diamond: '20-30 pets found',
      master: '30+ pets found'
    },
    data: enriched
  });
});

// POST: Quick Log Pet Found by Rescuer (to immediately level up or record rescue)
app.post('/api/leaderboard/log-rescue', (req, res) => {
  const { rescuerName, count = 1, petNickname = 'Community Pet' } = req.body;

  if (!rescuerName || !rescuerName.trim()) {
    return res.status(400).json({ success: false, error: 'Rescuer name is required.' });
  }

  const addedCount = Math.max(1, parseInt(count, 10) || 1);
  let rescuer = leaderboardStore.find(r => r.name.toLowerCase() === rescuerName.trim().toLowerCase());

  if (rescuer) {
    rescuer.petsFound += addedCount;
    rescuer.missionsCompleted += 1;
    rescuer.recentRescue = petNickname;
  } else {
    rescuer = {
      id: 'rescuer-' + Date.now(),
      name: rescuerName.trim(),
      role: 'Task Force Volunteer',
      petsFound: addedCount,
      missionsCompleted: 1,
      avatarColor: '#2563eb',
      recentRescue: petNickname,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    leaderboardStore.push(rescuer);
  }

  leaderboardStore.sort((a, b) => b.petsFound - a.petsFound);
  saveDb();
  const badgeInfo = calculateBadge(rescuer.petsFound);

  res.json({
    success: true,
    message: `Recorded ${addedCount} pet(s) found! ${rescuer.name} now has ${rescuer.petsFound} pets found with ${badgeInfo.tier} badge.`,
    data: {
      ...rescuer,
      badge: badgeInfo
    }
  });
});

// ------------------------------------------
// MODULE 5: Veterinarians Endpoints
// ------------------------------------------

// GET: Retrieve registered veterinarians (with optional ?area= and ?search=)
app.get('/api/veterinarians', (req, res) => {
  const { area, search } = req.query;
  let list = [...veterinariansStore];

  if (area && area !== 'all') {
    const a = area.toLowerCase().trim();
    list = list.filter(v =>
      v.area.toLowerCase().includes(a) ||
      a.includes(v.area.toLowerCase()) ||
      v.address.toLowerCase().includes(a)
    );
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.clinicName.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q) ||
      v.area.toLowerCase().includes(q) ||
      (v.visitFee && v.visitFee.toLowerCase().includes(q)) ||
      (v.services && v.services.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// POST: Register a new veterinarian & clinic
app.post('/api/veterinarians', (req, res) => {
  const {
    name,
    phoneNumber,
    clinicName,
    openTime,
    closeTime,
    clinicTime,
    visitFee,
    address,
    area,
    services
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Doctor name is required.' });
  }
  if (!phoneNumber || !phoneNumber.trim()) {
    return res.status(400).json({ success: false, error: 'Phone number is required.' });
  }
  if (!clinicName || !clinicName.trim()) {
    return res.status(400).json({ success: false, error: 'Clinic name is required.' });
  }
  if (!address || !address.trim()) {
    return res.status(400).json({ success: false, error: 'Clinic address is required.' });
  }

  const formattedOpen = openTime && openTime.trim() ? openTime.trim() : '08:00 AM';
  const formattedClose = closeTime && closeTime.trim() ? closeTime.trim() : '06:00 PM';
  const resolvedClinicTime = clinicTime && clinicTime.trim()
    ? clinicTime.trim()
    : `${formattedOpen} – ${formattedClose}`;

  const resolvedArea = area && area.trim() ? area.trim() : 'Neighborhood Zone';

  // Format general visit fee nicely in Indian Rupees (e.g., "300" -> "₹300", or custom text)
  let formattedFee = visitFee && visitFee.trim() ? visitFee.trim() : '₹300';
  if (/^\d+(\.\d{1,2})?$/.test(formattedFee)) {
    formattedFee = `₹${formattedFee}`;
  }

  const newVet = {
    id: 'vet-' + Date.now(),
    name: name.trim(),
    phoneNumber: phoneNumber.trim(),
    clinicName: clinicName.trim(),
    openTime: formattedOpen,
    closeTime: formattedClose,
    clinicTime: resolvedClinicTime,
    visitFee: formattedFee,
    address: address.trim(),
    area: resolvedArea,
    services: services && services.trim() ? services.trim() : 'General Veterinary Care, Wellness & Emergency Triage',
    registeredAt: new Date().toISOString()
  };

  veterinariansStore.unshift(newVet);
  saveDb();

  res.status(201).json({
    success: true,
    message: `${newVet.name} from ${newVet.clinicName} successfully registered! General Visit Fee: ${formattedFee}`,
    data: newVet
  });
});

// DELETE: Remove veterinarian
app.delete('/api/veterinarians/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = veterinariansStore.length;
  veterinariansStore = veterinariansStore.filter(v => v.id !== id);

  if (veterinariansStore.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Veterinarian not found.' });
  }

  saveDb();
  res.json({ success: true, message: 'Veterinarian removed successfully.' });
});

// ------------------------------------------
// MODULE 6: PET ESSENTIALS (Pet Stores & Pet Spas)
// ------------------------------------------

// --- Sub-Category 1: Pet Stores & Product Listings Endpoints ---

// GET: Retrieve registered pet stores (with optional ?area= and ?search=)
app.get('/api/pet-stores', (req, res) => {
  const { area, search } = req.query;
  let list = [...petStoresStore];

  if (area && area !== 'all') {
    const a = area.toLowerCase().trim();
    list = list.filter(s =>
      (s.area && s.area.toLowerCase().includes(a)) ||
      a.includes((s.area || '').toLowerCase()) ||
      (s.storeAddress && s.storeAddress.toLowerCase().includes(a))
    );
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(s =>
      s.storeName.toLowerCase().includes(q) ||
      s.storeAddress.toLowerCase().includes(q) ||
      (s.area && s.area.toLowerCase().includes(q)) ||
      (s.phoneNumber && s.phoneNumber.toLowerCase().includes(q)) ||
      (s.gmail && s.gmail.toLowerCase().includes(q)) ||
      (Array.isArray(s.products) && s.products.some(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      ))
    );
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// POST: Register a new Pet Store with product listings
app.post('/api/pet-stores', (req, res) => {
  const {
    storeName,
    storeAddress,
    phoneNumber,
    gmail,
    area,
    products = []
  } = req.body;

  if (!storeName || !storeName.trim()) {
    return res.status(400).json({ success: false, error: 'Pet Store Name is required.' });
  }
  if (!storeAddress || !storeAddress.trim()) {
    return res.status(400).json({ success: false, error: 'Store Address is required.' });
  }
  if (!phoneNumber || !phoneNumber.trim()) {
    return res.status(400).json({ success: false, error: 'Contact Phone Number is required.' });
  }
  if (!gmail || !gmail.trim()) {
    return res.status(400).json({ success: false, error: 'Gmail ID / Email address is required.' });
  }

  const resolvedArea = area && area.trim() ? area.trim() : 'Neighborhood Zone';

  // Format and sanitize products list
  const sanitizedProducts = (Array.isArray(products) ? products : []).map((p, idx) => {
    let priceFormatted = p.price && p.price.trim() ? p.price.trim() : '₹0';
    if (/^\d+(\.\d{1,2})?$/.test(priceFormatted)) {
      priceFormatted = `₹${priceFormatted}`;
    }
    return {
      id: p.id || 'prod-' + Date.now() + '-' + (idx + 1),
      name: (p.name || `Product #${idx + 1}`).trim(),
      price: priceFormatted,
      category: p.category && p.category.trim() ? p.category.trim() : 'Essentials',
      image: p.image || null,
      description: p.description && p.description.trim() ? p.description.trim() : 'Quality pet essential item available at store.'
    };
  });

  const newStore = {
    id: 'store-' + Date.now(),
    storeName: storeName.trim(),
    storeAddress: storeAddress.trim(),
    phoneNumber: phoneNumber.trim(),
    gmail: gmail.trim(),
    area: resolvedArea,
    products: sanitizedProducts,
    registeredAt: new Date().toISOString()
  };

  petStoresStore.unshift(newStore);
  saveDb();

  res.status(201).json({
    success: true,
    message: `Pet Store '${newStore.storeName}' registered with ${sanitizedProducts.length} product listing(s)!`,
    data: newStore
  });
});

// POST: Add new product listing to an existing Pet Store
app.post('/api/pet-stores/:id/products', (req, res) => {
  const { id } = req.params;
  const { name, price, image, description, category } = req.body;

  const store = petStoresStore.find(s => s.id === id);
  if (!store) {
    return res.status(404).json({ success: false, error: 'Pet Store not found.' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Product name is required.' });
  }

  let priceFormatted = price && price.trim() ? price.trim() : '₹0';
  if (/^\d+(\.\d{1,2})?$/.test(priceFormatted)) {
    priceFormatted = `₹${priceFormatted}`;
  }

  const newProduct = {
    id: 'prod-' + Date.now(),
    name: name.trim(),
    price: priceFormatted,
    category: category && category.trim() ? category.trim() : 'Essentials',
    image: image || null,
    description: description && description.trim() ? description.trim() : 'Quality pet essential item.'
  };

  if (!Array.isArray(store.products)) {
    store.products = [];
  }

  store.products.push(newProduct);
  saveDb();

  res.status(201).json({
    success: true,
    message: `Product '${newProduct.name}' added to ${store.storeName}!`,
    data: newProduct,
    store
  });
});

// DELETE: Remove Pet Store
app.delete('/api/pet-stores/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = petStoresStore.length;
  petStoresStore = petStoresStore.filter(s => s.id !== id);

  if (petStoresStore.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Pet Store not found.' });
  }

  saveDb();
  res.json({ success: true, message: 'Pet Store removed successfully.' });
});


// --- Sub-Category 2: Pet Spas & Grooming Services / Packages Endpoints ---

// GET: Retrieve registered pet spas (with optional ?area=, ?pet=, and ?search=)
app.get('/api/pet-spas', (req, res) => {
  const { area, search, pet } = req.query;
  let list = [...petSpasStore];

  if (area && area !== 'all') {
    const a = area.toLowerCase().trim();
    list = list.filter(s =>
      (s.area && s.area.toLowerCase().includes(a)) ||
      a.includes((s.area || '').toLowerCase()) ||
      (s.location && s.location.toLowerCase().includes(a)) ||
      (s.address && s.address.toLowerCase().includes(a))
    );
  }

  if (pet && pet !== 'all') {
    const p = pet.toLowerCase().trim();
    list = list.filter(s =>
      Array.isArray(s.services) && s.services.some(srv =>
        (srv.forPet && srv.forPet.toLowerCase().includes(p)) ||
        (srv.serviceName && srv.serviceName.toLowerCase().includes(p)) ||
        (srv.packageName && srv.packageName.toLowerCase().includes(p))
      )
    );
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(s =>
      s.spaName.toLowerCase().includes(q) ||
      (s.location && s.location.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q)) ||
      (s.area && s.area.toLowerCase().includes(q)) ||
      (s.contactNumber && s.contactNumber.toLowerCase().includes(q)) ||
      (s.gmail && s.gmail.toLowerCase().includes(q)) ||
      (Array.isArray(s.services) && s.services.some(srv => 
        (srv.serviceName && srv.serviceName.toLowerCase().includes(q)) || 
        (srv.packageName && srv.packageName.toLowerCase().includes(q)) || 
        (srv.forPet && srv.forPet.toLowerCase().includes(q)) || 
        (srv.description && srv.description.toLowerCase().includes(q))
      ))
    );
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// POST: Register a new Pet Spa with package / service listings
app.post('/api/pet-spas', (req, res) => {
  const {
    spaName,
    contactNumber,
    gmail,
    location,
    address,
    area,
    services = [],
    packages = []
  } = req.body;

  if (!spaName || !spaName.trim()) {
    return res.status(400).json({ success: false, error: 'Pet Spa Name is required.' });
  }
  const resolvedAddress = (address && address.trim()) || (location && location.trim());
  if (!resolvedAddress) {
    return res.status(400).json({ success: false, error: 'Spa Address / Location is required.' });
  }
  if (!contactNumber || !contactNumber.trim()) {
    return res.status(400).json({ success: false, error: 'Contact Number is required.' });
  }
  if (!gmail || !gmail.trim()) {
    return res.status(400).json({ success: false, error: 'Gmail ID / Email address is required.' });
  }

  const resolvedArea = area && area.trim() ? area.trim() : 'Neighborhood Zone';
  const rawList = Array.isArray(packages) && packages.length > 0 ? packages : (Array.isArray(services) ? services : []);

  // Format and sanitize package list
  const sanitizedServices = rawList.map((srv, idx) => {
    let costFormatted = srv.cost && srv.cost.trim() ? srv.cost.trim() : '₹600';
    if (/^\d+(\.\d{1,2})?$/.test(costFormatted)) {
      costFormatted = `₹${costFormatted}`;
    }
    const name = (srv.packageName || srv.serviceName || `Spa Package #${idx + 1}`).trim();
    const forPet = (srv.forPet || srv.forWhichPet || srv.targetPet || '🐾 Dogs & Cats (All Pets)').trim();
    return {
      id: srv.id || 'srv-' + Date.now() + '-' + (idx + 1),
      serviceName: name,
      packageName: name,
      forPet: forPet,
      cost: costFormatted,
      duration: srv.duration && srv.duration.trim() ? srv.duration.trim() : '60 mins',
      description: srv.description && srv.description.trim() ? srv.description.trim() : 'Full grooming, warm hydro-bath, claw trimming & coat conditioning.'
    };
  });

  // If no services were added, provide a default spa service package
  if (sanitizedServices.length === 0) {
    sanitizedServices.push({
      id: 'srv-' + Date.now() + '-1',
      serviceName: 'Full Dog Spa & Bath Package',
      packageName: 'Full Dog Spa & Bath Package',
      forPet: '🐶 Dogs (All Breeds)',
      cost: '₹850',
      duration: '60 mins',
      description: 'Warm hydro-massage wash, deep coat shampooing, high-velocity blow dry, ear cleaning & paw balm.'
    });
  }

  const newSpa = {
    id: 'spa-' + Date.now(),
    spaName: spaName.trim(),
    contactNumber: contactNumber.trim(),
    gmail: gmail.trim(),
    location: resolvedAddress,
    address: resolvedAddress,
    area: resolvedArea,
    services: sanitizedServices,
    packages: sanitizedServices,
    registeredAt: new Date().toISOString()
  };

  petSpasStore.unshift(newSpa);
  saveDb();

  res.status(201).json({
    success: true,
    message: `Pet Spa '${newSpa.spaName}' registered with ${sanitizedServices.length} package listing(s)!`,
    data: newSpa
  });
});

// POST: Add a new package / service item to an existing Pet Spa
const handleAddSpaPackage = (req, res) => {
  const { id } = req.params;
  const { serviceName, packageName, cost, forPet, forWhichPet, duration, description } = req.body;

  const spa = petSpasStore.find(s => s.id === id);
  if (!spa) {
    return res.status(404).json({ success: false, error: 'Pet Spa not found.' });
  }

  const name = (packageName || serviceName || '').trim();
  if (!name) {
    return res.status(400).json({ success: false, error: 'Package name is required.' });
  }

  let costFormatted = cost && cost.trim() ? cost.trim() : '₹500';
  if (/^\d+(\.\d{1,2})?$/.test(costFormatted)) {
    costFormatted = `₹${costFormatted}`;
  }

  const targetPet = (forPet || forWhichPet || '🐾 Dogs & Cats (All Pets)').trim();

  const newService = {
    id: 'srv-' + Date.now(),
    serviceName: name,
    packageName: name,
    forPet: targetPet,
    cost: costFormatted,
    duration: duration && duration.trim() ? duration.trim() : '50 mins',
    description: description && description.trim() ? description.trim() : 'Professional pet spa & grooming care.'
  };

  if (!Array.isArray(spa.services)) {
    spa.services = [];
  }

  spa.services.push(newService);
  spa.packages = spa.services;
  saveDb();

  res.status(201).json({
    success: true,
    message: `Package '${newService.packageName}' for ${targetPet} added to ${spa.spaName}!`,
    data: newService,
    spa
  });
};

app.post('/api/pet-spas/:id/services', handleAddSpaPackage);
app.post('/api/pet-spas/:id/packages', handleAddSpaPackage);

// DELETE: Remove Pet Spa
app.delete('/api/pet-spas/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = petSpasStore.length;
  petSpasStore = petSpasStore.filter(s => s.id !== id);

  if (petSpasStore.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Pet Spa not found.' });
  }

  saveDb();
  res.json({ success: true, message: 'Pet Spa removed successfully.' });
});

// Reset demo data endpoint
app.post('/api/reset', (req, res) => {
  petsStore = [...initialPets];
  straysStore = [...initialStrays];
  lostFoundStore = [...initialLostFound];
  leaderboardStore = [...initialLeaderboard];
  veterinariansStore = [...initialVeterinarians];
  petStoresStore = [...initialPetStores];
  petSpasStore = [...initialPetSpas];
  puppiesLaidStore = [...initialPuppiesLaid];
  accountsStore = [...initialAccounts];
  saveDb();
  res.json({ success: true, message: 'Data reset to defaults and saved to disk.' });
});

// POST: Client-Server Synchronization (reconciles local records so entered data is NEVER lost)
app.post('/api/sync', (req, res) => {
  const { pets = [], strays = [], lostFound = [], veterinarians = [], petStores = [], petSpas = [] } = req.body;
  let addedPets = 0;
  let addedStrays = 0;
  let addedLostFound = 0;
  let addedVets = 0;
  let addedStores = 0;
  let addedSpas = 0;

  // Sync pets: prevent duplicates by id or (name + ownerName)
  for (const clientPet of pets) {
    if (!clientPet || !clientPet.name) continue;
    const exists = petsStore.some(p => 
      (clientPet.id && p.id === clientPet.id) || 
      (p.name.toLowerCase().trim() === clientPet.name.toLowerCase().trim() &&
       p.ownerName.toLowerCase().trim() === (clientPet.ownerName || '').toLowerCase().trim())
    );
    if (!exists) {
      petsStore.unshift({
        id: clientPet.id || 'pet-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: clientPet.name.trim(),
        species: clientPet.species || 'Pet (Domestic)',
        age: clientPet.age || 'Unspecified',
        weight: clientPet.weight || 'Unspecified',
        breeder: clientPet.breeder || 'Private / Rescued',
        localArea: clientPet.localArea || 'Highland Park',
        ownerName: (clientPet.ownerName || 'Guardian').trim(),
        ownerContact: clientPet.ownerContact || 'Contact via PawsCause',
        notes: clientPet.notes || '',
        photo: clientPet.photo || null,
        registeredAt: clientPet.registeredAt || new Date().toISOString()
      });
      addedPets++;
    }
  }

  // Sync strays: prevent duplicates by id or (nickname + localArea)
  for (const clientStray of strays) {
    if (!clientStray || !clientStray.nickname) continue;
    const exists = straysStore.some(s => 
      (clientStray.id && s.id === clientStray.id) ||
      (s.nickname.toLowerCase().trim() === clientStray.nickname.toLowerCase().trim() &&
       s.localArea.toLowerCase().trim() === (clientStray.localArea || '').toLowerCase().trim())
    );
    if (!exists) {
      straysStore.unshift({
        id: clientStray.id || 'stray-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        nickname: clientStray.nickname.trim(),
        visualDescription: clientStray.visualDescription || 'Community stray record',
        localArea: clientStray.localArea || 'Local Zone',
        healthIndex: Array.isArray(clientStray.healthIndex) ? clientStray.healthIndex : [],
        reporterName: clientStray.reporterName || 'Community Member',
        timestamp: clientStray.timestamp || new Date().toISOString(),
        status: clientStray.status || 'Active Community Triage',
        photo: clientStray.photo || null,
        triageLevel: clientStray.triageLevel || 'Normal',
        notes: clientStray.notes || ''
      });
      addedStrays++;
    }
  }

  // Sync lost/found reports
  for (const clientLf of lostFound) {
    if (!clientLf || !clientLf.petName) continue;
    const exists = lostFoundStore.some(lf => 
      (clientLf.id && lf.id === clientLf.id) ||
      (lf.petName.toLowerCase().trim() === clientLf.petName.toLowerCase().trim() &&
       lf.contactName.toLowerCase().trim() === (clientLf.contactName || '').toLowerCase().trim())
    );
    if (!exists) {
      lostFoundStore.unshift({
        id: clientLf.id || 'lf-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        petName: clientLf.petName.trim(),
        status: clientLf.status || 'Lost',
        species: clientLf.species || 'Dog / Cat',
        description: clientLf.description || 'Community pet report',
        lastSeenLocation: clientLf.lastSeenLocation || 'Local Area',
        lastSeenDate: clientLf.lastSeenDate || new Date().toISOString().split('T')[0],
        contactName: clientLf.contactName || 'Community Member',
        contactPhone: clientLf.contactPhone || 'Community Dispatch',
        contactEmail: clientLf.contactEmail || '',
        contactAddress: clientLf.contactAddress || '',
        ownerName: clientLf.ownerName || '',
        ownerPhone: clientLf.ownerPhone || '',
        reunitedBy: clientLf.reunitedBy || null,
        reunitedAt: clientLf.reunitedAt || null,
        photo: clientLf.photo || null
      });
      addedLostFound++;
    }
  }

  // Sync veterinarians
  for (const clientVet of veterinarians) {
    if (!clientVet || !clientVet.name) continue;
    const exists = veterinariansStore.some(v =>
      (clientVet.id && v.id === clientVet.id) ||
      (v.name.toLowerCase().trim() === clientVet.name.toLowerCase().trim() &&
       v.clinicName.toLowerCase().trim() === (clientVet.clinicName || '').toLowerCase().trim())
    );
    if (!exists) {
      let formattedFee = clientVet.visitFee && clientVet.visitFee.trim() ? clientVet.visitFee.trim() : '₹300';
      if (/^\d+(\.\d{1,2})?$/.test(formattedFee)) {
        formattedFee = `₹${formattedFee}`;
      }
      veterinariansStore.unshift({
        id: clientVet.id || 'vet-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: clientVet.name.trim(),
        phoneNumber: clientVet.phoneNumber || 'Community Dispatch',
        clinicName: clientVet.clinicName || 'Local Animal Clinic',
        openTime: clientVet.openTime || '08:00 AM',
        closeTime: clientVet.closeTime || '06:00 PM',
        clinicTime: clientVet.clinicTime || '08:00 AM – 06:00 PM',
        visitFee: formattedFee,
        address: clientVet.address || 'Local Area',
        area: clientVet.area || 'Neighborhood Zone',
        services: clientVet.services || 'General Veterinary Care',
        registeredAt: clientVet.registeredAt || new Date().toISOString()
      });
      addedVets++;
    }
  }

  // Sync pet stores
  for (const clientStore of petStores) {
    if (!clientStore || !clientStore.storeName) continue;
    const exists = petStoresStore.some(s =>
      (clientStore.id && s.id === clientStore.id) ||
      (s.storeName.toLowerCase().trim() === clientStore.storeName.toLowerCase().trim() &&
       s.phoneNumber.trim() === (clientStore.phoneNumber || '').trim())
    );
    if (!exists) {
      petStoresStore.unshift({
        id: clientStore.id || 'store-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        storeName: clientStore.storeName.trim(),
        storeAddress: clientStore.storeAddress || 'Local Area',
        phoneNumber: clientStore.phoneNumber || '',
        gmail: clientStore.gmail || '',
        area: clientStore.area || 'Neighborhood Zone',
        products: Array.isArray(clientStore.products) ? clientStore.products : [],
        registeredAt: clientStore.registeredAt || new Date().toISOString()
      });
      addedStores++;
    }
  }

  // Sync pet spas
  for (const clientSpa of petSpas) {
    if (!clientSpa || !clientSpa.spaName) continue;
    const exists = petSpasStore.some(s =>
      (clientSpa.id && s.id === clientSpa.id) ||
      (s.spaName.toLowerCase().trim() === clientSpa.spaName.toLowerCase().trim() &&
       s.contactNumber.trim() === (clientSpa.contactNumber || '').trim())
    );
    if (!exists) {
      petSpasStore.unshift({
        id: clientSpa.id || 'spa-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        spaName: clientSpa.spaName.trim(),
        contactNumber: clientSpa.contactNumber || '',
        gmail: clientSpa.gmail || '',
        location: clientSpa.location || 'Local Area',
        area: clientSpa.area || 'Neighborhood Zone',
        services: Array.isArray(clientSpa.services) ? clientSpa.services : [],
        registeredAt: clientSpa.registeredAt || new Date().toISOString()
      });
      addedSpas++;
    }
  }

  // Sync puppies laid reports
  const incomingPuppies = Array.isArray(req.body.puppiesLaid) ? req.body.puppiesLaid : [];
  let addedPuppies = 0;
  for (const clientPup of incomingPuppies) {
    if (!clientPup || !clientPup.area) continue;
    const exists = puppiesLaidStore.some(p =>
      (clientPup.id && p.id === clientPup.id) ||
      (p.registeredBy.toLowerCase().trim() === (clientPup.registeredBy || '').toLowerCase().trim() &&
       p.area.toLowerCase().trim() === clientPup.area.toLowerCase().trim() &&
       p.phoneNumber.trim() === (clientPup.phoneNumber || '').trim())
    );
    if (!exists) {
      puppiesLaidStore.unshift({
        id: clientPup.id || 'puppies-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        registeredBy: clientPup.registeredBy || 'Community Member',
        area: clientPup.area || 'Neighborhood Zone',
        phoneNumber: clientPup.phoneNumber || 'Contact on file',
        puppyCount: parseInt(clientPup.puppyCount, 10) || 1,
        motherCondition: clientPup.motherCondition || 'Nursing mother dog on site',
        notes: clientPup.notes || '',
        status: clientPup.status || 'Monitored / Pending Govt Check',
        registeredAt: clientPup.registeredAt || new Date().toISOString()
      });
      addedPuppies++;
    }
  }

  // Sync accounts
  const incomingAccounts = Array.isArray(req.body.accounts) ? req.body.accounts : [];
  let addedAccounts = 0;
  for (const clientAcc of incomingAccounts) {
    if (!clientAcc || !clientAcc.email) continue;
    const exists = accountsStore.some(a => a.email.toLowerCase() === clientAcc.email.toLowerCase().trim());
    if (!exists) {
      accountsStore.unshift({
        id: clientAcc.id || 'acc-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        email: clientAcc.email.toLowerCase().trim(),
        name: clientAcc.name || clientAcc.email.split('@')[0],
        area: clientAcc.area || 'Neighborhood Zone',
        phone: clientAcc.phone || '',
        avatarColor: clientAcc.avatarColor || '#0284c7',
        avatarEmoji: clientAcc.avatarEmoji || '🐾',
        role: clientAcc.role || 'Pet Guardian',
        createdAt: clientAcc.createdAt || new Date().toISOString(),
        lastLoginAt: clientAcc.lastLoginAt || new Date().toISOString()
      });
      addedAccounts++;
    }
  }

  if (addedPets > 0 || addedStrays > 0 || addedLostFound > 0 || addedVets > 0 || addedStores > 0 || addedSpas > 0 || addedPuppies > 0 || addedAccounts > 0) {
    saveDb();
    console.log(`🔄 [Sync] Saved ${addedPets} pets, ${addedStrays} strays, ${addedLostFound} reports, ${addedVets} vets, ${addedStores} stores, ${addedSpas} spas, ${addedPuppies} puppies, ${addedAccounts} accounts to persistent disk.`);
  }

  res.json({
    success: true,
    message: `Synchronized: ${addedPets} pets, ${addedStrays} strays, ${addedLostFound} reports, ${addedVets} vets, ${addedStores} stores, ${addedSpas} spas, ${addedPuppies} puppies reports, ${addedAccounts} accounts.`,
    data: {
      pets: petsStore,
      strays: straysStore,
      lostFound: lostFoundStore,
      leaderboard: leaderboardStore,
      veterinarians: veterinariansStore,
      petStores: petStoresStore,
      petSpas: petSpasStore,
      puppiesLaid: puppiesLaidStore,
      accounts: accountsStore,
      loginLogs: loginLogsStore
    }
  });
});

// GET: Full persistent database export/backup
app.get('/api/backup', (req, res) => {
  res.json({
    success: true,
    exportedAt: new Date().toISOString(),
    stats: {
      petsCount: petsStore.length,
      straysCount: straysStore.length,
      lostFoundCount: lostFoundStore.length,
      leaderboardCount: leaderboardStore.length,
      veterinariansCount: veterinariansStore.length,
      petStoresCount: petStoresStore.length,
      petSpasCount: petSpasStore.length,
      puppiesLaidCount: puppiesLaidStore.length,
      accountsCount: accountsStore.length,
      loginLogsCount: loginLogsStore.length
    },
    database: {
      petsStore,
      straysStore,
      lostFoundStore,
      leaderboardStore,
      veterinariansStore,
      petStoresStore,
      petSpasStore,
      puppiesLaidStore,
      accountsStore,
      loginLogsStore
    }
  });
});

// POST: Restore database from JSON payload
app.post('/api/restore', (req, res) => {
  const { database } = req.body;
  if (!database) {
    return res.status(400).json({ success: false, error: 'Invalid backup format. database object required.' });
  }
  if (Array.isArray(database.petsStore)) petsStore = database.petsStore;
  if (Array.isArray(database.straysStore)) straysStore = database.straysStore;
  if (Array.isArray(database.lostFoundStore)) lostFoundStore = database.lostFoundStore;
  if (Array.isArray(database.leaderboardStore)) leaderboardStore = database.leaderboardStore;
  if (Array.isArray(database.veterinariansStore)) veterinariansStore = database.veterinariansStore;
  if (Array.isArray(database.petStoresStore)) petStoresStore = database.petStoresStore;
  if (Array.isArray(database.petSpasStore)) petSpasStore = database.petSpasStore;
  if (Array.isArray(database.puppiesLaidStore)) puppiesLaidStore = database.puppiesLaidStore;
  if (Array.isArray(database.accountsStore)) accountsStore = database.accountsStore;
  if (Array.isArray(database.loginLogsStore)) loginLogsStore = database.loginLogsStore;
  saveDb();
  res.json({
    success: true,
    message: `Successfully restored database: ${petsStore.length} pets, ${straysStore.length} strays, ${lostFoundStore.length} reports, ${veterinariansStore.length} vets, ${petStoresStore.length} pet stores, ${petSpasStore.length} pet spas, ${puppiesLaidStore.length} puppies reports, ${accountsStore.length} accounts.`,
    data: {
      petsCount: petsStore.length,
      straysCount: straysStore.length,
      lostFoundCount: lostFoundStore.length,
      veterinariansCount: veterinariansStore.length,
      petStoresCount: petStoresStore.length,
      petSpasCount: petSpasStore.length,
      puppiesLaidCount: puppiesLaidStore.length,
      accountsCount: accountsStore.length,
      loginLogsCount: loginLogsStore.length
    }
  });
});

export default app;
