import Head from "next/head";
import moment from 'moment';
import styles from "../../styles/store.module.css";
import { MainProduct, PostWidget, Categories, ArrayLocale } from "../../components";

export const getStaticPaths = async () => {
    var allGroupsSlug = ArrayLocale.allGroupsSlug;

    const paths = allGroupsSlug.map(slugGrp => {
        return {
            params: { slug: slugGrp.catSlug }
        }
    })

    return {
        paths,
        fallback: true
    }

}

export const getStaticProps = async ({ params }) => {
    var curtime = new Date();
    curtime = "Build time: " + moment(curtime).format('MMM DD, YYYY hh:mmm');
    const slug = params.slug;
    try {
        var grpcode = slug.substring(6, slug.length);
        var loccode = slug.substring(0, 5);
    } catch (error) {
        console.log(error);
        var grpcode = "";
        var loccode = "";
    }
    const url = 'https://www.philips.com/prx/category/B2C/' + loccode + '/SHOPPUB/' + grpcode + '.products';
    const res = await fetch(url);
    const productDataRes = await res.json();
    var productData = productDataRes.data.products;
    //var productData = productDataFull.slice(0,100); 
    var i = 0;
    var j = 0;
    var stockLevelzero = 0;
    var stockLevelCritical = 0;
    var stockLevelGood = 0;
    var newProdArray = [];
    const getMarkAcc = async (newUrl) => {
        const request = await fetch(newUrl);
        const apiData = await request.json();
        if (apiData.success) {
            var retData = apiData.data;
            return retData;
        } else {
            return [];
        }
    };
    const getComObj = async (newUrl) => {
        const request = await fetch(newUrl);
        const apiData = await request.json();
        var comObj = [];
        //console.log(newUrl);
        try {
            if (apiData) {
                return apiData;
            } else {
                return [];
            }
        } catch (error) {
            console.log(" Error A01" + error);
            return [];
        }
    };


    const getProductObject = (comObj, prod) => {
        var myObj = {};
        myObj.product = prod;
        myObj.productTitle = prod.productTitle;
        myObj.ctn = prod.ctn;
        myObj.brandName = prod.brandName;
        myObj.hasAcc = false;
        myObj.locale = prod.locale;
        myObj.acc = [];
        /*
            const accMarList = await getMarkAcc(m_url);
            myObj.acc = accMarList;
       */
        const accComList = comObj;
        myObj.comObj = [];
        if (accComList.productRelations) {
            myObj.comObj = accComList.productRelations;

        }
        myObj.stockLevel = accComList.stock.stockLevel;
        if (accComList.stock.stockLevel <= 0) stockLevelzero = stockLevelzero + 1;
        if (accComList.stock.stockLevel <= 30) stockLevelCritical = stockLevelCritical + 1;
        myObj.stockLevelStatus = accComList.stock.stockLevelStatus;
        i = i + 1;
        myObj.counter = i;
        myObj.stockLevelzero = stockLevelzero;
        myObj.stockLevelCritical = stockLevelCritical;
       
        return myObj;
    }

    const getComObjNew = async (prod) => {
        try {
            var ctnparam = prod.ctn;
            ctnparam = ctnparam.replace("/", "_");
            var countryCode = prod.locale.substring(3, 5)
            countryCode = countryCode === "GB" ? "UK" : countryCode;
            var c_newurl = `https://www.pil.occ.shop.philips.com/pilcommercewebservices/v2/${countryCode}_Pub/products/${ctnparam}`;
            const request = await fetch(c_newurl,{
                method: "GET",
                headers: {
                  // update with your user-agent
                  "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36", 
                  Accept: "application/json; charset=UTF-8",
                },
              });
            const apiData = await request.json();
            if (apiData) {
                return getProductObject(apiData, prod);
            } else {
                return [];
            }
        } catch (error) {
            console.log(" Error A02" +error);
            return [];
        }
    };

    const getProductData = (prod) => new Promise(
        (resolve) => {
            j= j+1;
            resolve(getComObjNew(prod));
        }
    );
    

    const getAllCommercePromise = async () => {
        const promises = productData.map((prod) => getProductData(prod));
        newProdArray = await Promise.all(promises);
    };
    
    if (productData != undefined) await getAllCommercePromise();
    console.log (`Value of i = ${i} and value of j =${j}`);
    var controlObj = {};
    controlObj.totalProduct = j;
    controlObj.totalProductWithData = i;
    controlObj.stockLevelzero = stockLevelzero;
    controlObj.stockLevelCritical = stockLevelCritical;
    return {
        props: { myProductData: newProdArray, myTime: curtime, slug: slug, mylocale: loccode, controlObj  },
        revalidate: 240,
    }


}

const Details = ({ myProductData, myTime, slug, mylocale, controlObj }) => {
    if (myProductData === undefined || myProductData.length === 0) {
        return (
            <div className="container mx-auto px-10 mb-8">
                <Head>
                    <title>Philips eStore {slug}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 ">
                    <div className="lg:col-span-8 col-span-1 bg-blue-900 bg-opacity-25">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                            <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold ">
                                There is no product in group {slug}
                            </span>
                        </div>
                    </div>
                    <div className="lg:col-span-4 col-span-1">
                        <div className="lg:sticky relative top-8">
                            < PostWidget group={""} loc={mylocale} myTime={myTime} />
                            < Categories group={""} loc={mylocale} myTime={myTime} />
                            <h1> {myTime}</h1>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 ">
                    <a href={`/stores/${mylocale}`} className="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-1 px-1 rounded"      >
                        Back
                    </a>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container mx-auto px-10 mb-8">
                <Head>
                    <title>Philips eStore </title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12  ">
                    <div className="lg:col-span-8 col-span-1">
                        <div className="lg:col-span-8 col-span-1 bg-blue-900 bg-opacity-25">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                            <div className="border-b w-full inline-block border-red-400 py-8">
                                <span className="md:float-left mt-2 align-middle text-white ml-4 font-semibold ">
                                    Out of Stock Products in  {slug} - 
                                    
                                </span>
                                <span className="md:float-left mt-2 align-middle text-white ml-4 ">
                                    Total Prod : {controlObj.totalProduct} / WithData : {controlObj.totalProductWithData} / Out of Stock : {controlObj.stockLevelzero}
                                </span>
                                </div> 
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {myProductData.map((myProduct) => (
                                (myProduct.stockLevel <= 0 &&
                                    <div className={styles.row}>
                                        <div className={styles.column}>
                                            <MainProduct key={myProduct.ctn} mainProduct={myProduct} />
                                        </div>
                                    </div>
                                )
                            ))}

                        </div>
                        <div className="lg:col-span-8 col-span-1 bg-blue-900 bg-opacity-25">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                            <div className="border-b w-full inline-block border-red-400 py-8">
                                <span className="md:float-left mt-2 align-middle text-white ml-4 font-semibold ">
                                    Critically Low Stock Products in  {slug}
                                </span>
                                </div>    
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {myProductData.map((myProduct) => (
                                (myProduct.stockLevel > 0 && myProduct.stockLevel <= 30 &&
                                    <div className={styles.row}>
                                        <div className={styles.column}>
                                            <MainProduct key={myProduct.ctn} mainProduct={myProduct} />
                                        </div>
                                    </div>
                                )
                            ))}

                        </div>

                        <div className="lg:col-span-8 col-span-1 bg-blue-900 bg-opacity-25">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                            <div className="border-b w-full inline-block border-red-400 py-8">
                                <span className="md:float-left mt-2 align-middle text-white ml-4 font-semibold ">
                                    Products online in  {slug}
                                </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {myProductData.map((myProduct) => (
                                (myProduct.stockLevel > 30 &&
                                    <div className={styles.row}>
                                        <div className={styles.column}>
                                            <MainProduct key={myProduct.ctn} mainProduct={myProduct} />
                                        </div>
                                    </div>
                                )
                            ))}

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
                    <a href={`/stores/${mylocale}`} className="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-1 px-1 rounded"      >
                        Back
                    </a>
                </div>
            </div>

        );
    }
}

export default Details;
