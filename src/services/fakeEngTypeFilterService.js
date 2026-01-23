export const engTypes = [
  { _id: "2001", name: "Electric" },
  { _id: "2002", name: "Diesel" },
  { _id: "2003", name: "LPG" },
  { _id: "2005", name: "Rough Terrain" },
  { _id: "2006", name: "Reach" },
  { _id: "2007", name: "Warehouse" }
];

export function getEngTypes(restricted) {
  // Since we consolidated the data sources, both regular and restricted use the same engine types
  // The pricing difference is handled in the backend based on user type
  return engTypes.filter(g => g);
}
