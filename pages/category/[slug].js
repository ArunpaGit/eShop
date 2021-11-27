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
        console.log (error);
        var grpcode = "";
        var loccode = "";
    }
    //const url = 'https://www.philips.com/prx/category/B2C/' + slug;
    const url = 'https://www.philips.com/prx/category/B2C/' + loccode + '/SHOPPUB/' + grpcode + '.products';
    // en_US/SHOPPUB/PERSONAL_CARE_GR.products
    //console.log("Cat Stug: " + slug + "- loc :" + loccode + "- Grp :" + grpcode + " - URL = " + url);
    const res = await fetch(url);
    const productDataRes = await res.json();
    var productData = productDataRes.data.products;
    var i = 1;
    var stockLevelzero = 0;
    var stockLevelCritical = 0;
    var stockLevelGood = 0;
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
                comObj.push(apiData.productRelations);
                //return apiData.productRelations;
                return apiData;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };
// const eachProd of productData.slice(0, 1)
    var myObjArr = [];

    if (productData) {
        for (const eachProd of productData) {
            var myObj = {};
            // === 'HX6857/11'
            // === 'HX9990/11'
            //=== 'RQ32/22'
            // === 'S7783/84' both acc same
            // === 'HX6062/95' Only in ecom acc
            if (eachProd.ctn) {
                //console.log(eachProd);
                i = i+1;
                myObj.product = eachProd;
                myObj.productTitle = eachProd.productTitle;
                myObj.ctn = eachProd.ctn;
                myObj.brandName = eachProd.brandName;
                myObj.hasAcc = false;
                myObj.locale = eachProd.locale;
                var ctnparam = eachProd.ctn;
                var countryCode = eachProd.locale.substring(3, 5)
                countryCode = countryCode === "GB" ? "UK" : countryCode;
                ctnparam = ctnparam.replace("/", "_");
                var m_url = `https://www.philips.com/prx/product/B2C/${myObj.locale}/CONSUMER/products/${ctnparam}.accessories`;
                var c_url = `https://www.pil.occ.shop.philips.com/pilcommercewebservices/v2/${countryCode}_Pub/products/${ctnparam}`;
                myObj.acc = [];

                /*
                const accMarList = await getMarkAcc(m_url);
                myObj.acc = accMarList;
                */
                const accComList = await getComObj(c_url);
                myObj.comObj = [];
                if (accComList.productRelations) {
                    myObj.stockLevel = accComList.stock.stockLevel;
                    myObj.stockLevelStatus = accComList.stock.stockLevelStatus;
                    myObj.comObj = accComList.productRelations;
                    if (accComList.stock.stockLevel <= 0 )  stockLevelzero = stockLevelzero + 1;
                    if (accComList.stock.stockLevel <= 30 ) stockLevelCritical = stockLevelCritical + 1;
                }
                myObj.counter = i;
                myObj.stockLevelzero = stockLevelzero;
                myObj.stockLevelCritical = stockLevelCritical;
                myObjArr.push(myObj);

            }
        }
        if (i > 0) {
            return {
                props: { myProductData: myObjArr, myTime: curtime, slug: slug, mylocale: loccode },
                revalidate: 60
            }
        } else {
            return {
                props: { myProductData: myObjArr, myTime: curtime, slug: slug, mylocale: loccode },
                revalidate: 60
            }
        }
    } else {
        return {
            props: { myProductData: myObjArr, myTime: curtime, slug: slug, mylocale: loccode },
            revalidate: 60
        }
    }

}

const Details = ({ myProductData, myTime, slug, mylocale }) => {
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
                            < PostWidget />
                            < Categories />
                            <h1> {myTime}</h1>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 ">
                    <a href={`/stores/${mylocale}`} class="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-1 px-1 rounded"      >
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
                                <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold ">
                                    Out of Stock Products in  {slug} 
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold ">
                                    Critically Low Stock Products in  {slug}
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold ">
                                    Products online in  {slug}
                                </span>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <a href={`/stores/${mylocale}`} class="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-1 px-1 rounded"      >
                        Back
                    </a>
                </div>
            </div>

        );
    }
}

export default Details;