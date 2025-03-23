import React from "react";
import styled from "styled-components";

interface InventoryProps {
  inventory: {
    [key: string]: number;
  };
}

const MAX_SLOTS = 8;
const placeholderIcon = ""; // Placeholder icon for empty slots
const fruitIcons: { [key: string]: string } = {
  pear: "🍐",
  orange: "🍊",
  grapes: "🍇",
  tomato: "🍅",
};

const Inventory: React.FC<InventoryProps> = ({ inventory }) => {
  // Convert inventory object into an array of collected items (in order of appearance)
  const inventoryItems = Object.entries(inventory).filter(
    ([_, count]) => count > 0
  );

  // Fill the remaining slots with placeholders, maintaining the order of collected items
  const slots = [
    ...inventoryItems,
    ...Array.from({ length: MAX_SLOTS - inventoryItems.length }, () => [
      null,
      0,
    ]),
  ];

  return (
    <InventoryContainer>
      <h3>Inventory</h3>
      <BagGrid>
        {slots.map(([fruit, count], i) => (
          <BagSlot key={i}>
            {fruit ? (
              <FruitIcon>{fruitIcons[fruit]}</FruitIcon>
            ) : (
              placeholderIcon
            )}
            {count && count > 1 && <Badge>{count}</Badge>}
          </BagSlot>
        ))}
      </BagGrid>
    </InventoryContainer>
  );
};

export default Inventory;

const InventoryContainer = styled.div`
  background: #d6d6d6;
  border: 2px solid #444;
  color: white;
  border-radius: 10px;
  padding: 15px;
  width: 240px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: "Arial", sans-serif;
  margin: 80px;

  h3 {
    color: #363636;
  }
`;

const BagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px;
`;

const BagSlot = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  background: #a3a3a3;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.1);
  font-size: 24px;
  color: white;
  text-align: center;
`;

const FruitIcon = styled.span`
  font-size: 32px;
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;
