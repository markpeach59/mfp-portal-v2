// Marketing image category tree
// Mirrors the Google Drive folder structure
// Up to 4 levels deep: tier1 > tier2 > tier3 > tier4
//
// 'id' values become the subcategory/subcategory2/subcategory3 slugs stored in MongoDB
// 'label' is the human-readable display name shown in the UI

export const MARKETING_CATEGORIES = [
  {
    id: 'electric-a-series-action-shots',
    label: 'Electric A-Series Action Shots'
    // No children — images live directly at this level
  },
  {
    id: 'lithium-ax-series-action-shots',
    label: 'Lithium AX Series Action Shots'
  },
  {
    id: 'white-background-imagery',
    label: 'White Background Imagery',
    children: [
      {
        id: 'ice',
        label: 'ICE',
        children: [
          {
            id: 'a-series-ice-4-7t',
            label: 'A Series, ICE, 4–7T',
            children: [
              { id: 'a-series-5-7t-diesel',          label: 'A Series 5–7T Diesel Forklift' },
              { id: 'a-series-4-compact-5t-gas-lpg',  label: 'A Series 4-Compact 5T Gasoline & LPG Forklift' }
            ]
          },
          { id: 'a-series-ice-5-7t',             label: 'A Series, ICE, 5–7T' },
          { id: 'a-series-ice-2-5-3-5t',          label: 'A Series, ICE, 2.5–3.5T' },
          { id: 'a-series-ice-8-10t',             label: 'A Series, ICE, 8–10T' },
          { id: 'm-series-ice-1-1-8t-upgraded',   label: 'M Series, ICE, 1–1.8T Upgraded' },
          { id: 'm-series-ice-2-5-3-5t',          label: 'M Series, ICE, 2.5–3.5T' },
          { id: 'm-series-ice-4-compact-5t',      label: 'M Series, ICE, 4-Compact 5T' },
          { id: 'm-series-ice-5-7t',              label: 'M Series, ICE, 5–7T' },
          { id: 'm-series-ice-8-compact-12t',     label: 'M Series, ICE, 8-Compact 12T' }
        ]
      },
      {
        id: 'electric-forklift',
        label: 'Electric Forklift',
        children: [
          { id: 'ax-series-lithium-2-5-3-5t',           label: 'AX Series, Lithium, 2.5–3.5T' },
          { id: 'ax-series-lithium-4-5-5t',              label: 'AX Series, Lithium, 4.5–5T' },
          { id: 'ax-series-lithium-8-10t',               label: 'AX Series, Lithium, 8–10T' },
          { id: 'ax-series-2wd-rough-terrain-lithium-2-5-3-5t', label: 'AX Series, 2WD Rough Terrain, Lithium, 2.5–3.5T' },
          { id: 'a-series-4-wheel-lead-acid-1-5-3-5t',  label: 'A Series, 4 Wheel, Lead Acid, 1.5–3.5T' },
          { id: 'm-series-3-wheel-front-drive-lead-acid-1-6-2t', label: 'M Series, 3 Wheel, Front Drive, Lead Acid, 1.6–2T' },
          { id: 'm-series-3-wheel-rear-drive-lead-acid-1-6t',    label: 'M Series, 3 Wheel, Rear Drive, Lead Acid, 1.6T' }
        ]
      },
      {
        id: 'rough-terrain',
        label: 'Rough Terrain',
        children: [
          { id: 'rough-terrain-1-8-3-5t-4wd', label: '1.8–3.5T 4WD' },
          { id: 'rough-terrain-2-5-3-5t-2wd', label: '2.5–3.5T 2WD' },
          { id: 'rough-terrain-5t-2wd',        label: '5T 2WD' }
        ]
      },
      {
        id: 'warehouse-equipment',
        label: 'Warehouse Equipment',
        children: [
          { id: 'pt20-pallet-truck',                     label: 'PT20 Pallet Truck' },
          { id: 'ptl-pallet-truck',                      label: 'PTL Pallet Truck' },
          { id: 'pte-pallet-truck',                      label: 'PTE Pallet Truck' },
          { id: 'a-series-reach-truck-lead-acid-1-6-2-5t', label: 'A Series, Reach Truck, Lead Acid, 1.6–2.5T' },
          { id: 'a-series-reach-truck-lithium-1-6-2-5t',   label: 'A Series, Reach Truck, Lithium, 1.6–2.5T' }
        ]
      }
    ]
  },
  {
    id: 'tg-builder-application-images',
    label: 'TG Builder Application Images'
  },
  {
    id: 'rough-terrain-action-shots',
    label: 'Rough Terrain Action Shots'
  }
];

// Helper: find a node anywhere in the tree by its id
export function findCategoryById(id, nodes = MARKETING_CATEGORIES) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findCategoryById(id, node.children);
      if (found) return found;
    }
  }
  return null;
}

// Helper: build the breadcrumb path to a given id
// Returns array of { id, label } from root to the node
export function getCategoryPath(id, nodes = MARKETING_CATEGORIES, path = []) {
  for (const node of nodes) {
    const currentPath = [...path, { id: node.id, label: node.label }];
    if (node.id === id) return currentPath;
    if (node.children) {
      const found = getCategoryPath(id, node.children, currentPath);
      if (found) return found;
    }
  }
  return null;
}
