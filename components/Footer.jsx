import React, { useState, useEffect } from "react";

import Link from "next/link";



const Footer = () => {
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full inline-block border-red-400 py-8">
        <div className="md:float-left block">
          <Link href="/">
            <span className="cursor-pointer font-bold text-4xl text-white">
              ## eShop  ## 
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
