# Integrating Unity WebGL with React

## Overview

This document outlines the process of integrating a **Unity WebGL build** into a React application. It covers:

- Embedding a Unity WebGL instance in a React component.
- Sending messages **from React to Unity**.
- Receiving messages **from Unity to React**.

This guide provides a reusable template that other developers can follow to integrate Unity WebGL into their projects.

---

## 1. Setting Up Unity WebGL in React

To integrate Unity WebGL into a React app, follow these steps:

### **Step 1: Create a Unity WebGL Build**

1. Open **Unity** and navigate to `File > Build Settings`.
2. Select **WebGL** as the target platform.
3. Configure build settings to ensure compression and proper loading:
    - Enable `Development Build` (for debugging, optional for production).
    - Set **compression format** to `Gzip` or `Brotli` (to reduce file size).
    - Set `Data Caching` enabled (for performance).
4. Click **Build** and place the generated files in a `/Build` directory within the React project.

---

### **Step 2: Create a UnityComponent in React**

The following React component loads the Unity WebGL build and enables communication between React and Unity.

### **UnityComponent.tsx**

```jsx
import { useEffect, useRef } from "react";

const UnityComponent = () => {
  const unityRef = useRef<HTMLDivElement>(null);
  const [unityInstance, setUnityInstance] = useState<any>(null);

	// Set up the canvas and Unity Instance
  useEffect(() => {
    if (!unityRef.current) return;

    // Create and append Unity canvas
    const canvas = document.createElement("canvas");
    canvas.id = "unity-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    unityRef.current.appendChild(canvas);

    // Load Unity WebGL script
    const script = document.createElement("script");
    script.src = "/Build/UnityBuild.loader.js"; // Update with correct path
    script.onload = () => {
      (window as any)
        .createUnityInstance(canvas, {
          dataUrl: "/Build/UnityBuild.data.gz",
          frameworkUrl: "/Build/UnityBuild.framework.js.gz",
          codeUrl: "/Build/UnityBuild.wasm.gz",
          streamingAssetsUrl: "/StreamingAssets",
          companyName: "YourCompany",
          productName: "YourGame",
          productVersion: "1.0",
        })
        .then((instance: any) => {
          console.log("Unity Loaded!", instance);
          setUnityInstance(instance);
        })
        .catch((error: any) => {
          console.error("Unity loading failed:", error);
        });
    };

    document.body.appendChild(script);
  }, []);
  
  // Unity message calls (for React -> Unity comms)
  useEffect(() => {
    if (!unityInstance) return;

    const sendMessageToUnity = () => {
      unityInstance.SendMessage("GameObjectName", "UnityMethod");
    };

    const sendMessageWithParam = (param: string) => {
      unityInstance.SendMessage("GameObjectName", "UnityMethod", param);
    };

    // Expose these functions globally if needed
    (window as any).sendMessageToUnity = sendMessageToUnity;
    (window as any).sendMessageWithParam = sendMessageWithParam;
  }, [unityInstance]); // Runs when `unityInstance` is set

  return (
    <Container>
      <h2>React ↔️ Unity WebGL</h2>
      <Content>
        <div ref={unityRef} style={{ width: "550px", height: "800px", margin: "auto" }} />
        <button onClick={() => (window as any).sendMessageToUnity?.()}>Send Message to Unity</button>
        <button onClick={() => (window as any).sendMessageWithParam?.("Hello Unity!")}>
          Send Message with Param
        </button>
      </Content>
    </Container>
  );
};

export default UnityComponent;
```

---

## 2. Sending Messages from React to Unity

To communicate with Unity, use `SendMessage`:

```
if ((window as any).unityInstance) {
  (window as any).unityInstance.SendMessage("GameObjectName", "UnityMethod", "OptionalParameter");
}
```

### **Unity Setup (C#)**

Ensure the **Unity GameObject** has a script that listens for messages:

```
using UnityEngine;

public class UnityReceiver : MonoBehaviour {
    public void UnityMethod(string message) {
        Debug.Log("Received message from React: " + message);
    }
}
```

---

## 3. Receiving Messages from Unity to React

Unity can call JavaScript functions using `window`:

### **Unity C# Script:**

```
using UnityEngine;
public class UnityToReact : MonoBehaviour {
    void SendDataToReact() {
        Application.ExternalCall("ReactFunction", "Hello from Unity!");
    }
}
```

### **React Listener:**

In React, define a global function:

```
useEffect(() => {
  (window as any).ReactFunction = (message: string) => {
    console.log("Received from Unity:", message);
  };
}, []);
```

---

## 4. Debugging & Common Issues

### **1. Unity Not Loading?**

- Check the **file paths** for `loader.js`, `framework.js`, and `wasm.gz`.
- Open the browser console (`F12` > Console) for errors.

### **2. Messages Not Sending?**

- Ensure the **GameObject name** in `SendMessage` matches the Unity hierarchy.
- Make sure the **Unity method is public**.

### **3. `ExternalCall` Not Working?**

- If using `Application.ExternalCall`, enable WebGL templates that support JavaScript calls.

---

## 5. Summary

This document provides:

- A **React component** to embed Unity WebGL.
- Methods for **React ↔ Unity** communication.
- Debugging tips for common issues.

Following these steps, other developers can seamlessly integrate Unity WebGL into React applications.
