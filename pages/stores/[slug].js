import Head from "next/head";
import moment from 'moment';
import { GroupCard, PostWidget, Categories, ArrayLocale } from "../../components";

export const getStaticPaths = async () => {

  const allshops = ArrayLocale.allshops;
  
  // map data to an array of path objects with params (id)
  const paths = allshops.map(shop => {
    return {
      params: { slug: shop.locale }
    }
  })
  return {
    paths,
    fallback: false
  }

}

export const getStaticProps = async ({ params }) => {
  var curtime = new Date();
  curtime= "Build time: " + moment(curtime).format('MMM DD, YYYY hh:mmm');
  const slug = params.slug;
  const url = 'https://www.philips.com/prx/category/B2C/' + slug + '/SHOPPUB.groups';
  const res = await fetch(url);
  const apiData = await res.json();
  
  if (apiData.success) {
    return {
      props: { mydata: apiData.data, myTime: curtime, mylocale : slug },
      revalidate: 300,
    }
  } else {
    return [];
  }
}

const Details = ({ mydata, myTime,mylocale }) => {
  return (

    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 ">
        <div className="lg:col-span-8 col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {mydata.map((mygrp) =>  <GroupCard group={mygrp} loc={mylocale} key={mygrp.code} />)}
          </div>
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            < PostWidget group={""} loc={mylocale} myTime={myTime} />
            < Categories group={""} loc={mylocale} myTime={myTime} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 ">
      <a  href="/"  class="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-1 px-1 rounded"      >
        Home
      </a>
      </div>
    </div>

  );
}

export default Details;