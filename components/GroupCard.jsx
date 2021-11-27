import React from "react";
import Link from "next/link";

const GroupCard = ({ group,loc }) => {
 
  return (
    <div className="box-content h-22 w-132 p-2 bg-white shadow-lg rounded-lg bg-opacity-25" >
       
       <Link href={"/category/" + loc + "_" + group.code} key={group.code}>
      <p className="font-semibold md:not-italic text-xm text-black hover:text-red-500 ">{loc} /{group.domain}/{group.name} ({group.code}) </p>
      </Link>
    </div>
  );
};

export default GroupCard;
