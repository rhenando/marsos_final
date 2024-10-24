"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const Preloader = () => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev < 100) {
          return prev + 1; // Increase by 1 until it reaches 100
        } else {
          clearInterval(interval); // Clear interval when progress is 100
          return prev;
        }
      });
    }, 50); // Adjust speed of progress by changing interval time

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50'>
      <div className='w-64'>
        <Progress
          value={progressValue}
          className='h-4 transition-all duration-300'
        />
      </div>
    </div>
  );
};

export default Preloader;
