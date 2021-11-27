import React from "react";


const Categories = ({group,loc,myTime}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8 ">
        <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        
        <span className="align-middle">{myTime}</span>
        
        
      </div>
    
  );
};

export default Categories;
