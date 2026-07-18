export type MenuItem = {
  id: string;
  name: string;
  description?: string;
};

export type MenuCourse = {
  id: string;
  title: string;
  subtitle: string;
  /** included = served for the table; single = guest picks one */
  selection: "included" | "single";
  items: MenuItem[];
};

export type CelebrationMenu = {
  id: string;
  label: string;
  title: string;
  courses: MenuCourse[];
};

export const celebrationMenus: CelebrationMenu[] = [
  {
    id: "premium",
    label: "Premium",
    title: "Premium Menu",
    courses: [
      {
        id: "to-share",
        title: "To Share",
        subtitle: "Served for the table",
        selection: "included",
        items: [
          {
            id: "patatas-bravas",
            name: "Patatas bravas",
            description:
              "Romesco and sriracha brava sauce, all i oli and smoked paprika.",
          },
          {
            id: "shrimp-croquettes",
            name: "Shrimp croquettes",
          },
          {
            id: "burrata-salad",
            name: "Burrata salad",
            description:
              "Fresh and semidried cherry tomatoes, crispy focaccia, basil and black olives.",
          },
          {
            id: "iberian-ham",
            name: "Iberian acorn-fed ham",
            description: "Served with bread and tomato.",
          },
        ],
      },
      {
        id: "main",
        title: "Main Course",
        subtitle: "To choose from",
        selection: "single",
        items: [
          {
            id: "beef-picanha",
            name: "Beef picanha steak from Girona",
            description:
              "Grilled in Josper Oven, Celeriac purée, bimi and demi-glace.",
          },
          {
            id: "spicy-salmon",
            name: "Spicy asian salmon",
            description:
              "Josper grilled, lime, pepper and ginger. Served with crushed baby potatoes with sesame and spring onion.",
          },
          {
            id: "mushroom-risotto",
            name: "Traditional mushroom risotto",
            description: "Cooked with Grana Padano.",
          },
        ],
      },
      {
        id: "dessert",
        title: "Dessert",
        subtitle: "To choose from",
        selection: "single",
        items: [
          {
            id: "lemon-millefeuille",
            name: "Lemon Millefeuille",
            description:
              "Caramelized puff pastry, with spiced milk mousse, lemon cream.",
          },
          {
            id: "puro-brownie",
            name: "Puro brownie",
          },
        ],
      },
    ],
  },
];

export function getMenuById(menuId: string) {
  return celebrationMenus.find((menu) => menu.id === menuId) ?? celebrationMenus[0];
}
