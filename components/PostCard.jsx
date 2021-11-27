import React from "react";
import Link from "next/link";

const PostCard = ({ shop }) => {
  return (
    <div class="box-content h-22 w-32 p-4 border-2 rounded-lg p-1 transform bg-white-100 hover:bg-blue-200 transition duration-500 hover:scale-110">
      
      
      <Link href={"/stores/" + shop.locale} key={shop.locale}>
        <img src={shop.image} alt={shop.cname} height="80" width="100" />
      </Link>
    </div>
  );
};

export default PostCard;
