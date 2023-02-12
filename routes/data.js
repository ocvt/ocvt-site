/* Used mainly to display trip dates */
const dayString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday'];

const monthShortString = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'June', 'July', 'Aug', 'Sep', 'Oct',
  'Nov', 'Dec'];

/* Used to lookup additional info for notification types */
const generalTypes = {
  GENERAL_ANNOUNCEMENTS: {
    description: 'Important Club Announcements',
    id: 'GENERAL_ANNOUNCEMENTS',
    name: 'Club Updates / News / Events',
  },
};

const tripTypes = {
  TRIP_BACKPACKING: {
    description: 'Multi day hikes.',
    id: 'TRIP_BACKPACKING',
    name: 'Backpacking',
  },
  TRIP_BIKING: {
    description: 'Road or mountain biking.',
    id: 'TRIP_BIKING',
    name: 'Biking',
  },
  TRIP_CAMPING: {
    description: 'Single overnight trips.',
    id: 'TRIP_CAMPING',
    name: 'Camping',
  },
  TRIP_CLIMBING: {
    description: 'Rock climbing or bouldering.',
    id: 'TRIP_CLIMBING',
    name: 'Climbing',
  },
  TRIP_DAYHIKE: {
    description: 'In and out on the same day.',
    id: 'TRIP_DAYHIKE',
    name: 'Dayhike',
  },
  TRIP_LASER_TAG: {
    description: 'Laser Tag with LCAT',
    id: 'TRIP_LASER_TAG',
    name: 'Laser Tag',
  },
  TRIP_OFFICIAL_MEETING: {
    description: 'An official OCVT meeting',
    id: 'TRIP_OFFICIAL_MEETING',
    name: 'Official Meeting',
  },
  TRIP_OTHER: {
    description: 'Anything else not covered. ',
    id: 'TRIP_OTHER',
    name: 'Other',
  },
  TRIP_RAFTING_CANOEING_KAYAKING: {
    description: 'Rafting / Canoeing / Kayaking',
    id: 'TRIP_RAFTING_CANOEING_KAYAKING',
    name: 'Rafting / Canoeing / Kayaking',
  },
  TRIP_ROAD_TRIP: {
    description: 'Just getting out and about, Ex a trip to Busch Gardens or DC etc',
    id: 'TRIP_ROAD_TRIP',
    name: 'Road Trip',
  },
  TRIP_SKIING_SNOWBOARDING: {
    description: 'Skiing / Snowboarding',
    id: 'TRIP_SKIING_SNOWBOARDING',
    name: 'Skiing / Snowboarding',
  },
  TRIP_SNOW_OTHER: {
    description: 'Sledding snowshoeing etc',
    id: 'TRIP_SNOW_OTHER',
    name: 'Snow / Other',
  },
  TRIP_SOCIAL: {
    description: 'Strictly social, potluck, movie nights, games or other casual gatherings',
    id: 'TRIP_SOCIAL',
    name: 'Social',
  },
  TRIP_SPECIAL_EVENT: {
    description: 'A special event.',
    id: 'TRIP_SPECIAL_EVENT',
    name: 'Special Event',
  },
  TRIP_TEAM_SPORTS_MISC: {
    description: 'Football, basketball ultimate Frisbee etc.',
    id: 'TRIP_TEAM_SPORTS_MISC',
    name: 'Team Sports / Misc.',
  },
  TRIP_WATER_OTHER: {
    description: 'Swimming, tubing anything else in the water.',
    id: 'TRIP_WATER_OTHER',
    name: 'Water / Other',
  },
  TRIP_WORK_TRIP: {
    description: 'Trail work or other maintenance.',
    id: 'TRIP_WORK_TRIP',
    name: 'Worktrip',
  },
};

export {
  dayString,
  monthShortString,
  generalTypes,
  tripTypes,
};
