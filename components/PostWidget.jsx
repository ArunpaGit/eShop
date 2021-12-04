import React from "react";

const PostWidget = ({group,loc,myTime}) => {
  console.log ("AA loc" + loc);
  ( loc === undefined || loc === "" ) ? loc ="/" : loc = "/stores/"  + loc ;
  console.log ("AA loc -> " + loc);
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">
        Dashboards (to be added)
      </h3>
      
      <a  href="/"  className="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-2 px-4 rounded"      >
        Home
      </a>
      <span> </span>
      <a  href={`${loc}`}  className="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-2 px-4 rounded">
         Back
      </a>
      
    </div>
  );
};

export default PostWidget;
