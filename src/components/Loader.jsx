import React from "react";
import { RingLoader } from "react-spinners";

const Loader = ({ loading = true, size = 100, color = "#36d7b7" }) => {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <RingLoader
        color={color}
        loading={loading}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
