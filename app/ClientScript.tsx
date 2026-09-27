"use client";

import { useEffect } from "react";

export default function ClientScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/main.js";
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return null;
}
