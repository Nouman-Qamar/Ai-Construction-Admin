export const laborersData = [
  {
    key: "1",
    name: "Ali Hassan",
    email: "ali.hassan@example.com",
    trade: "Masonry",
    rating: 4.7,
    projects: 20,
    status: "Active"
  },
  {
    key: "2",
    name: "Rita Gomez",
    email: "rita.gomez@example.com",
    trade: "Electrical",
    rating: 4.6,
    projects: 15,
    status: "Active"
  },
  {
    key: "3",
    name: "Samir Patel",
    email: "samir.patel@example.com",
    trade: "Carpentry",
    rating: 4.5,
    projects: 18,
    status: "Active"
  },
  {
    key: "4",
    name: "Nora Lee",
    email: "nora.lee@example.com",
    trade: "Plumbing",
    rating: 4.4,
    projects: 11,
    status: "Active"
  }
];

export const getTradeColor = (trade) => {
  const colors = {
    Masonry: "#FEF3C7",
    Electrical: "#D1FAE5",
    Carpentry: "#DBEAFE",
    Plumbing: "#CCFBF1"
  };
  return colors[trade] || "#FFF9F2";
};

export const getTradeTextColor = (trade) => {
  const colors = {
    Masonry: "#92400E",
    Electrical: "#065F46",
    Carpentry: "#1E40AF",
    Plumbing: "#0F766E"
  };
  return colors[trade] || "#5C2A0A";
};
