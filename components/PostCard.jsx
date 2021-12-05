import React from "react";
import Link from "next/link";
import styles from '../styles/store.module.css'
const PostCard = ({ shop }) => {
  return (
    <div className="box-content h-22 w-25 p-4 border-2 rounded-lg p-1 transform bg-white-100 hover:bg-blue-200 transition duration-200 hover:scale-110">
      <Link href={"/stores/" + shop.locale} key={shop.locale}>
        <img src={shop.image} alt={shop.cname} className={styles.responsiveImgFlg} height="80" width="80" />
      </Link>
    </div>
  );
};

export default PostCard;
