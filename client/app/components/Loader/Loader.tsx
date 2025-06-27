import React from "react";
import "./Loader.css";

const Loader = () => {
   return (
      <div className="flex justify-center items-center h-screen dark:bg-slate-800 bg-white">
         <div className="loader"></div>
      </div>
   )
}

export default Loader;