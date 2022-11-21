import Head from "next/head";
import moment from 'moment';
import { PostCard, PostWidget, Categories, ArrayLocale } from "../components";


export const getStaticProps = async ({ params }) => {
  var curtime = new Date();
  const shops = ArrayLocale.allshops;
  curtime = "Build time: " + moment(curtime).format('MMM DD, YYYY hh:mmm');

 return {
    props: { myShops: shops, myTime: curtime, mylocale: "" }
  }

}

export default function Home({ myShops, myTime, mylocale }) {
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Aruns Shop </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 ">
        <div className="lg:col-span-8 col-span-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {myShops.map((shop) => <PostCard shop={shop} key={shop.locale} />)}
          </div>
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
          < PostWidget group={""} loc={mylocale} myTime={myTime} />
            < Categories group={""} loc={mylocale} myTime={myTime} />
          </div>
        </div>
      </div>
    </div>
  );
}
