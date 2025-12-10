# 🎯 Yelp AI Vibe Matcher

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Find your perfect spot based on the vibe you're looking for**

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [API](#api)

</div>

---

## 🌟 Overview

**Yelp AI Vibe Matcher** is an innovative search experience that goes beyond traditional business discovery. Instead of just searching by keywords or categories, users can find the perfect place based on the **atmosphere and vibe** they're looking for—whether it's a quiet focus-friendly café, a cozy date spot, or a lively social venue.

Built for the Yelp API AI Hackathon, this project leverages the **Yelp AI API** to provide intelligent, context-aware recommendations that match user preferences across three key vibe dimensions:

- 🔇 **Quiet Level**: From library-quiet to buzzing energy
- ☕ **Cozy Factor**: From minimal to ultra-cozy atmosphere
- 🎯 **Focus Level**: From social/casual to highly focused environments

## ✨ Features

### ☕️ Interactive Vibe Sliders
- **Intuitive Controls**: Adjust three vibe parameters to express exactly what atmosphere you're seeking
- **Real-time Feedback**: See how your preferences translate into search criteria
- **Visual Icons**: Clear representation of each vibe dimension

### 🤖 AI-Powered Search
- **Natural Language Processing**: Converts your vibe preferences into intelligent search queries
- **Yelp AI Integration**: Leverages Yelp's advanced AI API for contextual understanding
- **Smart Scoring**: Each business gets a vibe score calculated from reviews, categories, and attributes

### 📍 Location-Aware
- **Automatic Geolocation**: Detects your current location for nearby results
- **Manual Location Input**: Search anywhere in the world
- **Flexible Radius**: Customize search distance

### 🎯 Vibe Matching Algorithm
- **Multi-Factor Analysis**: Evaluates businesses based on:
  - Review content sentiment analysis
  - Business categories and attributes
  - Operational characteristics (hours, pricing, etc.)
- **Match Percentage**: Each result shows how well it matches your vibe preferences
- **Breakdown Display**: See individual scores for quiet, cozy, and focus factors

### 💡 Smart Business Cards
- **Rich Information**: Display photos, ratings, reviews, pricing, and location
- **Vibe Indicators**: Visual representation of each business's vibe profile
- **Match Score**: Prominent display of overall vibe match percentage
- **Direct Links**: Quick access to full Yelp listings and directions

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Polished interactions and transitions
- **Yelp Branding**: Consistent with Yelp's visual identity
- **Accessible**: Built with accessibility best practices

## 🏗️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **API Integration**: Yelp Fusion API v3 & Yelp AI API
- **Icons**: React Icons
- **Deployment Ready**: Optimized for Vercel deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm, yarn, pnpm, or bun
- Yelp API Key ([Get one here](https://www.yelp.com/developers/v3/manage_app))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gnguye5-alt/yelp-api-ai-hackathon.git
   cd yelp-api-ai-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   YELP_API_KEY=your_yelp_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Search

1. **Set Your Vibe**: Adjust the three sliders to match your desired atmosphere
2. **Enter Search Terms**: Type what you're looking for (e.g., "coffee shop", "restaurant", "bar")
3. **Choose Location**: Allow geolocation or manually enter a location
4. **Search**: Click the search button to find matching businesses
5. **Explore Results**: Browse businesses sorted by vibe match percentage

### Understanding Vibe Scores

Each business displays:
- **Overall Match**: Percentage showing how well it matches your preferences
- **Individual Scores**:
  - 🔇 Quiet level (0-100)
  - ☕ Cozy factor (0-100)
  - 🎯 Focus level (0-100)

## 🔧 API Routes

### `/api/yelp/search` (GET)
Standard Yelp Fusion API search

**Query Parameters:**
- `term`: Search term (e.g., "coffee")
- `location`: Location string (e.g., "San Francisco, CA")
- `latitude` / `longitude`: Geographic coordinates
- `radius`: Search radius in meters
- `categories`: Business categories
- `limit`: Number of results (default: 20)
- `sort_by`: Sort order (default: "best_match")

### `/api/yelp/ai` (POST)
AI-powered vibe-based search

**Request Body:**
```json
{
  "query": "coffee shop",
  "location": "San Francisco, CA",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "QuietLevel": 30,
  "cozyFactor": 70,
  "focusLevel": 80,
  "chatId": "optional-for-conversation-continuity"
}
```

**Response:**
```json
{
  "businesses": [...],
  "total": 20,
  "aiResponse": {
    "text": "AI-generated response",
    "chatId": "conversation-id"
  },
  "query": "Enhanced natural language query"
}
```

## 🧮 Vibe Scoring Algorithm

The vibe matching algorithm analyzes multiple factors:

### Quiet Level Calculation
- Business categories (bars, nightclubs = high Quiet)
- Review content analysis for keywords like "quiet", "loud", "peaceful"
- Time of day and operational hours

### Cozy Factor Calculation
- Categories (cafes, lounges = higher cozy)
- Attributes (fireplace, outdoor seating, intimate)
- Price point and review sentiment

### Focus Level Calculation
- Categories (libraries, co-working spaces = high focus)
- Review mentions of "work-friendly", "wifi", "quiet"
- Inverse correlation with Quiet level

### Overall Match Score
Weighted average of how closely each business's vibe profile matches user preferences, normalized to 0-100%.

## 📁 Project Structure

```
yelp-ai-vibe-matcher/
├── app/
│   ├── api/
│   │   └── yelp/
│   │       ├── search/route.ts    # Standard Yelp search
│   │       └── ai/route.ts        # AI-powered vibe search
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── components/
│   ├── BusinessCard.tsx           # Business result card
│   ├── VibeIndicator.tsx          # Vibe score display
│   ├── VibeSlider.tsx             # Vibe preference slider
│   └── Icons.ts                   # Icon exports
├── lib/
│   └── yelp.ts                    # Yelp API utilities
├── public/                        # Static assets
└── README.md
```

## 🎨 Design Decisions

### Why Vibe-Based Search?
Traditional search focuses on *what* you're looking for. Vibe-based search focuses on *how* you want to feel. This creates a more intuitive and emotionally-aware discovery experience.

### Why Yelp AI API?
The Yelp AI API's natural language understanding allows us to:
- **Extract sensory context** from thousands of reviews ("too loud," "peaceful," "overstimulating")
- **Understand nuanced preferences** beyond simple filters
- **Provide explanations** for why a venue matches or doesn't match

This would be impossible with traditional keyword-based search.

## 🌍 Impact & Scalability

### **Immediate Impact: Accessibility**
**Primary Users:** Students, remote workers, parents, introverts, anyone who values atmosphere

**Benefits:**
- ✅ Increase confidence in social participation
- ✅ Save time and energy avoiding overwhelming spaces
- ✅ Enable participation in activities previously avoided
- ✅ Foster independence and autonomy

**Market Opportunity:** This addresses a gap in Yelp's current offering—**emotional/atmospheric search**—which complements their category-based and rating-based search.

### **Business Alignment with Yelp**
- 📈 **Increased Engagement**: Users search more specifically, leading to more sessions
- 🎯 **Better Matches**: Higher satisfaction = more conversions and repeat usage
- 💡 **Differentiation**: No competitor offers sensory-based local search
- 🌐 **Inclusive Brand**: Positions Yelp as leader in accessible technology
- 📊 **Data Insights**: Aggregated sensory data reveals new business trends

### **How We Use Yelp AI API:**
1. **Natural Language Query Generation**: Convert sensory slider preferences into contextual queries
2. **AI-Powered Business Discovery**: Leverage Yelp AI's understanding of review context
3. **Sensory Data Extraction**: Analyze business attributes, reviews, and categories for sensory scoring
4. **Match Ranking**: Score and rank businesses based on sensory profile alignment

**No other APIs are used for business or location data. Yelp AI API is the sole data source.**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Yelp** for providing the API and AI API
- **Next.js** team for the amazing framework
- **Vercel** for hosting and deployment platform
- All the places that inspired this project ☕

## 📧 Contact

- Hayley Nguyen - [@gnguye5-alt](https://github.com/gnguye5-alt)
- Tim Huynh - [@khuynh22](https://github.com/khuynh22)
- Project Link: [https://github.com/gnguye5-alt/yelp-api-ai-hackathon](https://github.com/gnguye5-alt/yelp-api-ai-hackathon)

---

<div align="center">

**Built with 💙 for accessibility and inclusion**
</div>
