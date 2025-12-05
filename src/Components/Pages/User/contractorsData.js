export const contractorsData = [
  {
    key: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    specialty: "Commercial",
    rating: 4.8,
    projects: 12,
    status: "Active",
    
    
  },
  {
    key: "2",
    name: "James Brown",
    email: "james.brown@example.com",
    specialty: "Residential",
    rating: 4.5,
    projects: 8,
    status: "Active",
   
    
  },
  {
    key: "3",
    name: "David Miller",
    email: "david.miller@example.com",
    specialty: "Industrial",
    rating: 4.9,
    projects: 15,
    status: "Active",
   
    
  },
  {
    key: "4",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    specialty: "Renovation",
    rating: 4.7,
    projects: 10,
    status: "Active",
  
    
  },
 
  
];

export const getSpecialtyColor = (specialty) => {
  const colors = {
    Commercial: "#FEF3C7",
    Residential: "#D1FAE5",
    Industrial: "#DBEAFE",
    Renovation: "#CCFBF1"
  };
  return colors[specialty] || "#FFF9F2";
};

export const getSpecialtyTextColor = (specialty) => {
  const colors = {
    Commercial: "#92400E",
    Residential: "#065F46",
    Industrial: "#1E40AF",
    Renovation: "#0F766E"
  };
  return colors[specialty] || "#5C2A0A";
};
