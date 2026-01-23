export const forklift = {
  modelname: "KBD15",
  imgName: require("../photos/KB20.jpg"),
  engType: "Diesel",
  engine: "ISUZU Diesel Engine C240-30 Euro 5",
  rangeName: "D Series",
  rangeCat: "1-1.5T",
  liftcapacity: 1500,

  selection: {},
  totalprice: 11303,

  masts: [
    {
      _id: 1,
      masttype: "2 Stage Mast",
      sizes: [
        { _id: 1, length: 3000, price: 0 },
        { _id: 2, length: 3300, price: 225 },
        { _id: 3, length: 4000, price: 395 },
        { _id: 4, length: 4500, price: 640 },
        { _id: 5, length: 5000, price: 760 }
      ]
    },
    {
      _id: 2,
      masttype: "2 Stage Full Free Mast",
      sizes: [
        { _id: 1, length: 3000, price: 501 },

        { _id: 3, length: 4000, price: 896 }
      ]
    },
    {
      _id: 3,
      masttype: "3 Stage Full Free Mast",
      sizes: [
        { _id: 1, length: 4350, price: 1200 },
        { _id: 2, length: 4500, price: 1350 },
        { _id: 3, length: 4700, price: 1490 },
        { _id: 4, length: 5000, price: 1620 },
        { _id: 5, length: 5500, price: 1710 },
        { _id: 6, length: 6000, price: 1988 }
      ]
    }
  ],

  forks: [
    { _id: 1, length: 1070, price: 0 },
    { _id: 2, length: 1200, price: 95 },
    { _id: 3, length: 1370, price: 169 },
    { _id: 4, length: 1500, price: 265 },
    { _id: 5, length: 1670, price: 311 }
  ],

  sideshifts: [
    { _id: 1, type: "None", price: 0 },
    { _id: 2, type: " Hook On", price: 350 },
    { _id: 3, type: "Integral", price: 800 }
  ]
};

export function getForkliftDetail() {
  console.log("Fork is", forklift);
  return forklift;
}
