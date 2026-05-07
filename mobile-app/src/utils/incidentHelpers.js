// 1. Logic for Status Labels and Badge Colors
export const getStatusDetails = (status) => {
  switch (status) {
    case 'Pending':
      return { color: '#F6AA1C', label: 'Pending', icon: 'clock-outline' };
    case 'Verified':
    case 'Assigned':
      return { color: '#2ECC71', label: 'Verified', icon: 'check-circle-outline' };
    case 'Resolved':
      return { color: '#2B2D42', label: 'Resolved', icon: 'checkbox-marked-circle' };
    case 'Rejected':
      return { color: '#D62828', label: 'Rejected', icon: 'close-circle-outline' };
    default:
      return { color: '#8D99AE', label: status || 'Pending', icon: 'alert-circle-outline' };
  }
};

// 2. Simple color mapping for incident types
export const getTypeColor = (type) => {
  const mapping = {
    'Fire': '#D62828',
    'Medical': '#2ECC71',
    'Accident': '#F6AA1C',
    'Crime': '#2B2D42',
    'Disaster': '#D62828'
  };
  return mapping[type] || '#8D99AE';
};

// 3. Dynamic Asset and Color mapping based on Incident Type
export const getIncidentTypeAssets = (type) => {
  const assets = {
    'Fire': {
      image: require('../../assets/default_fire.jpg'),
      color: '#D62828', // Fire Red
    },
    'Medical': {
      image: require('../../assets/default_medical.jpg'),
      color: '#2ECC71', // Medical Green
    },
    'Accident': {
      image: require('../../assets/default_accident.jpg'),
      color: '#F6AA1C', // Accident Orange
    },
    'Crime': {
      image: require('../../assets/default_crime.jpg'),
      color: '#2B2D42', // Dark Grey
    },
    'Disaster': {
      image: require('../../assets/default_disaster.jpg'),
      color: '#D62828',
    },
  };

  // Fallback if the type is "Other" or unknown
  const fallback = {
    image: require('../../assets/default_fire.jpg'), 
    color: '#8D99AE',
  };

  return assets[type] || fallback;
};
