import { useEffect, useRef, useState } from "react";

const UnityComponent = () => {
  const unityRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!unityRef.current) return;

    // Ensure a valid <canvas> exists
    const canvas = document.createElement("canvas");
    canvas.id = "unity-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    unityRef.current.appendChild(canvas);

    // Load Unity WebGL script
    const script = document.createElement("script");
    script.src = "/Build/WebGL.loader.js"; // Ensure path matches build
    script.onload = () => {
      (window as any)
        .createUnityInstance(canvas, {
          dataUrl: "/Build/WebGL.data",
          frameworkUrl: "/Build/WebGL.framework.js",
          codeUrl: "/Build/WebGL.wasm",
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

    // Define the function that Unity will call
    (window as any).IncrementReactCounter = () => {
      setCounter((prevCounter) => {
        const newCounter = prevCounter + 1;
        console.log("React Counter:", newCounter);
        return newCounter;
      });
    };
  }, []);

  // Send React command to run Unity function
  const incrementUnityCounter = () => {
    if ((window as any).unityInstance) {
      (window as any).unityInstance.SendMessage(
        "GameManager",
        "IncrementCounter"
      );
    }
  };

  return (
    <div>
      <h1>Unity WebGL in React</h1>
      <div ref={unityRef} style={{ width: "100%", height: "500px" }} />
      <p>React Counter: {counter}</p>
      <button onClick={incrementUnityCounter}>Increment Counter</button>
    </div>
  );
};

export default UnityComponent;
