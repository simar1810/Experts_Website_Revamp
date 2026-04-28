export const expertsItems = Array.from({ length: 10 }, (_, i) => ({
  "_id": {
    "$oid": "699c5d4061657e2c1832f78e"
  },
  "coach": {
    "$oid": "69712426f8a60f4254fd14fc"
  },
  "isActive": true,
  "profilePhoto": "http://example.com/profile-photo.jpg",
  "planLevel": -1,
  "city": "New York",
  "state": "New York",
  "country": "USA",
  "location": {
    "type": "Point",
    "coordinates": [
      -73.935242,
      40.73061
    ]
  },
  "locationPrivacy": false,
  "offersOnline": true,
  "offersInPerson": true,
  "specializations": [
    "Yoga",
    "Meditation"
  ],
  "languages": [
    "English",
    "Spanish"
  ],
  "yearsExperience": 5,
  "clientsTrained": 300,
  "certifications": {
    "institute": "Yoga Academy",
    "names": [
      "Yoga Instructor Certification",
      "Meditation Master"
    ],
    "isVerified": true,
    "hasClaims": false
  },
  "socials": {
    "instagram": "https://instagram.com/coachprofile",
    "youtube": "https://youtube.com/coachprofile",
    "twitter": "https://twitter.com/coachprofile"
  },
  "reviewAgg": {
    "totalReviews": 0,
    "recent90d": 0,
    "repliedCount": 0
  },
  "reviews": [],
  "scoreCache": {
    "recommendedScore": 0.28768554446698197,
    "updatedAt": {
      "$date": "2026-02-23T13:59:28.806Z"
    }
  },
  "fieldEdits": [
    {
      "field": "yearsExperience",
      "oldValue": 0,
      "newValue": 5,
      "changedAt": {
        "$date": "2026-02-23T13:59:28.802Z"
      },
      "_id": {
        "$oid": "699c5d4061657e2c1832f78f"
      }
    },
    {
      "field": "clientsTrained",
      "oldValue": 0,
      "newValue": 300,
      "changedAt": {
        "$date": "2026-02-23T13:59:28.803Z"
      },
      "_id": {
        "$oid": "699c5d4061657e2c1832f790"
      }
    }
  ],
  "ratingAgg": {
    "knowledge": {
      "avg": 0,
      "count": 0,
      "bayes": 0
    },
    "results": {
      "avg": 0,
      "count": 0,
      "bayes": 0
    },
    "communication": {
      "avg": 0,
      "count": 0,
      "bayes": 0
    },
    "punctuality": {
      "avg": 0,
      "count": 0,
      "bayes": 0
    },
    "workoutQuality": {
      "avg": 0,
      "count": 0,
      "bayes": 0
    },
    "overall": {
      "avg": 0,
      "count": 0,
      "bayes": 0
    }
  },
  "createdAt": {
    "$date": "2026-02-23T13:59:28.810Z"
  },
  "updatedAt": {
    "$date": "2026-02-23T13:59:28.810Z"
  },
  "__v": 0,
  id: i
}))

export const mockPrograms = Array.from({ length: 10 }, (_, i) => ({
  "_id": {
    "$oid": "69aeaaca6a4b1af667801e7b" + i
  },
  "expertListing": {
    "$oid": "698e5ec54717ed8918718421"
  },
  "coach": {
    "$oid": "688b370c88a9bbb6bf0c4bec"
  },
  "title": "12 Week Fat Loss Program",
  "about": "Structured fat loss coaching program",
  "duration": 12,
  "durationUnit": "weeks",
  "durationLabel": "12 Weeks",
  "clientsCount": 120,
  "clientsVisible": true,
  "activeDiscount": {
    "code": "SAVE20",
    "percentDiscount": 20,
    "originalAmount": 4999,
    "validTill": null,
    "visible": true
  },
  "isActive": true,
  "amount": 3999,
  "currency": "INR",
  "featured": true,
  "faqs": [
    {
      "question": "Is this beginner friendly?",
      "answer": "Yes absolutely"
    }
  ],
  "tags": [
    "fat loss",
    "nutrition"
  ],
  "status": "published",
  "displayOrder": 1,
  "coverImage": "https://example.com/program.jpg",
  "shortDescription": "Complete transformation program",
  "createdAt": {
    "$date": "2026-03-09T11:11:06.234Z"
  },
  "updatedAt": {
    "$date": "2026-03-09T11:11:06.234Z"
  },
  "__v": 0,
  id: i
}))