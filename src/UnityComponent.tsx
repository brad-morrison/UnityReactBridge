import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Inventory from "./Inventory";

type InventoryType = {
  [key: string]: number;
};

const UnityComponent = () => {
  const unityRef = useRef<HTMLDivElement>(null);
  const [inventory, setInventory] = useState<InventoryType>({
    pear: 0,
    tomato: 0,
    grape: 0,
    orange: 0,
  });
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (!unityRef.current) return;

    // Ensure a valid <canvas> exists
    const canvas = document.createElement("canvas");
    canvas.id = "unity-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.borderRadius = "15px"; // Add rounded corners to the game container
    unityRef.current.appendChild(canvas);

    // Load Unity WebGL script
    const script = document.createElement("script");
    script.src = "/Build/FruitBuild-compressed.loader.js"; // Ensure path matches build
    script.onload = () => {
      (window as any)
        .createUnityInstance(canvas, {
          dataUrl: "/Build/FruitBuild-compressed.data.gz",
          frameworkUrl: "/Build/FruitBuild-compressed.framework.js.gz",
          codeUrl: "/Build/FruitBuild-compressed.wasm.gz",
          streamingAssetsUrl: "/StreamingAssets",
          companyName: "YourCompany",
          productName: "YourGame",
          productVersion: "1.0",
        })
        .then((instance: any) => {
          console.log("Unity Loaded!", instance);
          (window as any).unityInstance = instance;
        })
        .catch((error: any) => {
          console.error("Unity loading failed:", error);
        });
    };

    document.body.appendChild(script);

    // Listen for Unity events
    (window as any).FruitClicked = (name: string) => {
      setInventory((prevInventory) => ({
        ...prevInventory,
        [name]: (prevInventory[name] || 0) + 1,
      }));
      setAmount((prevAmount) => prevAmount + 50);
    };
  }, []);

  // Send React command to run Unity function
  const spawnFruit = () => {
    if ((window as any).unityInstance) {
      (window as any).unityInstance.SendMessage("Spawner", "SpawnRandomObject");
    }
  };

  // Send React command to run Unity function
  const sellFruit = () => {
    if ((window as any).unityInstance) {
      (window as any).unityInstance.SendMessage(
        "coins",
        "UpdateCoinDisplay",
        amount.toString()
      );
    }
    setAmount(0);
    // reset inventory
    setInventory({
      pear: 0,
      tomato: 0,
      grape: 0,
      orange: 0,  
    });
};

  return (
    <Container>
      <h2>React ↔️ Unity WebGL</h2>
      <Content>
        <div
          ref={unityRef}
          style={{ width: "550px", height: "800px", margin: "auto" }}
        />
        <Interface>
          <button onClick={spawnFruit}>Spawn Fruit</button>
          <Inventory inventory={inventory} />
          <h3>Value of fruit: {amount}</h3>
          <button onClick={sellFruit}>Sell Fruit</button>
        </Interface>
      </Content>
    </Container>
  );
};

export default UnityComponent;

const Container = styled.div`
  text-align: center;
  font-family: "Arial", sans-serif;
  h2 {
    margin: 40px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Interface = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  min-width: 200px;

  button {
    display: inline-block;
    outline: 0;
    border: 0;
    cursor: pointer;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
    will-change: box-shadow, transform;
    background: #fcfcfd;
    box-shadow: 0px 2px 4px rgb(45 35 66 / 40%),
      0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px #d6d6e7;
    height: 48px;
    padding: 0 32px;
    font-size: 18px;
    border-radius: 6px;
    color: #36395a;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
    :hover {
      box-shadow: 0px 4px 8px rgb(45 35 66 / 40%),
        0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px #d6d6e7;
      transform: translateY(-2px);
    }
    :active {
      box-shadow: inset 0px 3px 7px #d6d6e7;
      transform: translateY(2px);
    }
  }
`;
