# Smart Recycling Unit ♻️  

## Overview  
EcoRewards is a QR-based reward system where users scan recycling QR codes to earn points. Points can be redeemed for unique alphanumeric codes, which expire in 3 days.  

## Features  
✅ **QR Scanning:** Users scan QR codes to earn points.  
✅ **Profile Tracking:** Users can view their accumulated points and redemption history.  
✅ **Redemption System:** Every 100 points generate a redeemable code.  
✅ **History Log:** Displays scanned QR timestamps and redeemed codes.  
✅ **Secure Authentication:** Uses JWT-based authentication.  

## Tech Stack  
- **Frontend:** Next.js, Tailwind CSS, React Hot Toast  
- **Backend:** Next.js API Routes, MongoDB  
- **Auth:** JWT-based authentication  

## API Endpoints  
- `/api/users/scan` → Scan QR code and update points  
- `/api/users/history` → Fetch scan and redemption history  
- `/api/users/redeem` → Redeem points for a unique code  

## Setup Instructions  
1. Clone the repo & install dependencies:  
   ```bash
   git clone <repo-url>
   cd SRU
   npm install
