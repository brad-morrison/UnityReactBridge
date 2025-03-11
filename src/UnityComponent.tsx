import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const UnityComponent = () => {
  const unityRef = useRef<HTMLDivElement>(null);
  const [pearCount, setPearCount] = useState(0);
  const [tomatoCount, setTomatoCount] = useState(0);
  const [grapeCount, setGrapeCount] = useState(0);
  const [orangeCount, setOrangeCount] = useState(0);

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
    script.src = "/Build/FruitBuild.loader.js"; // Ensure path matches build
    script.onload = () => {
      (window as any)
        .createUnityInstance(canvas, {
          dataUrl: "/Build/FruitBuild.data",
          frameworkUrl: "/Build/FruitBuild.framework.js",
          codeUrl: "/Build/FruitBuild.wasm",
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

    (window as any).FruitClicked = (name: string) => {
      if (name === "pear") {
        setPearCount((prevCounter) => prevCounter + 1);
      } else if (name === "grapes") {
        setGrapeCount((prevCounter) => prevCounter + 1);
      } else if (name === "orange") {
        setOrangeCount((prevCounter) => prevCounter + 1);
      } else if (name === "tomato") {
        setTomatoCount((prevCounter) => prevCounter + 1);
      }
    };
  }, []);

  // Send React command to run Unity function
  const spawnFruit = () => {
    if ((window as any).unityInstance) {
      (window as any).unityInstance.SendMessage("Spawner", "SpawnRandomObject");
    }
  };

  return (
    <Container>
      <h1>Unity WebGL in React</h1>
      <Content>
        <div
          ref={unityRef}
          style={{ width: "500px", height: "800px", margin: "auto" }}
        />
        <Interface>
          <button onClick={spawnFruit}>Spawn Fruit</button>
          <Inventory>
            <h2>Inventory</h2>
            <InventoryItem>
              <FruitIcon>🍐</FruitIcon>
              <p>Pears: {pearCount}</p>
            </InventoryItem>
            <InventoryItem>
              <FruitIcon>🍊</FruitIcon>
              <p>Oranges: {orangeCount}</p>
            </InventoryItem>
            <InventoryItem>
              <FruitIcon>🍇</FruitIcon>
              <p>Grapes: {grapeCount}</p>
            </InventoryItem>
            <InventoryItem>
              <FruitIcon>🍅</FruitIcon>
              <p>Tomatoes: {tomatoCount}</p>
            </InventoryItem>
          </Inventory>
        </Interface>
      </Content>
    </Container>
  );
};

export default UnityComponent;

const Container = styled.div`
  text-align: center;
  font-family: "Arial", sans-serif;
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
`;

const Inventory = styled.div`
  background: linear-gradient(to bottom, #ffffff, #f1f3f5);
  border: 2px solid #dee2e6;
  color: #242424;
  border-radius: 15px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
  margin: 50px;
`;

const InventoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  color: #242424;
  padding: 10px;
  border-radius: 10px;
  margin: 8px 0;
  transition: transform 0.2s ease-in-out;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }
`;

const FruitIcon = styled.span`
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffebcd;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;
