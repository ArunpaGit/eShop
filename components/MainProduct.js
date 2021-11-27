import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/store.module.css'

export default function MainProduct({ mainProduct }) {
    return (
      <div className={styles.product_items} >
      <div className={styles.product}>
        <div className={styles.product_content}>
         <a href={mainProduct.product.domain + mainProduct.product.productURL} target="_blank"> 
         <Image src={mainProduct.product.imageURL}   width={220}  height={160}
          />
          </a>
        
            <div className={styles.product_info_top}>
              <a href = {mainProduct.product.domain + mainProduct.product.productURL} target="_blank" className={styles.product_name}>{mainProduct.product.productTitle} </a>
            </div>
            <div className={styles.product_info_top}>
               (Stock {mainProduct.stockLevel} )
            </div>
        <div className={styles.off_ctn}>
          <h2 className={styles.sm_title}>{mainProduct.product.ctn} </h2> 
        </div>       
        
        <div className={styles.off_brand_info}>
          <h2 className={styles.sm_title}>{mainProduct.product.brandName}  </h2> 
        </div>
        
        {mainProduct.stockLevel <= 0 &&
        <div className={styles.off_Stock}>
          <h2 className={styles.sm_title}>{mainProduct.stockLevelStatus}</h2>
        </div>
        }
        </div>
        </div>
    </div>
           
    
    )
  }
  