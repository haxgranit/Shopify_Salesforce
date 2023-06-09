const puppeteer = require('puppeteer'); 
const fs = require('fs'); 
const appendFileSync = require('fs').appendFileSync; 

(async () => { 
	
	const browser = await puppeteer.launch(); 

	const page = await browser.newPage(); 
 
	await page.goto('https://store.optum.com/shop/category/medication-treatment/diabetes/', {waitUntil: 'networkidle0',}); 
 
	const html = await page.content();

	//await fs.writeFile('optum_stomach_digestive.html', html); 
  //document.querySelectorAll('div[class^=Card-module_card__body]')
  const products = await page.evaluate(() => {
    let imgs = Array.from(document.querySelectorAll('img.ProductCard-module--product-card__image--2YRJe'))
    let prices = Array.from(document.querySelectorAll('div[class^=Card-module_card__body] div p'))
    let count = 0;
    return Array.from(document.querySelectorAll('a.Product-module_product-card__image__vfsYJ'), (productLink) => {
      let product = {link: '',alt: '',price: '',Status: 'active',Vendor: 'GeissMed',ProductCategory: 'Health & Beauty > Health Care',Type: 'Product',UnitType: 'box',Tags: 'diabetes',Published: 'TRUE',VariantGrams: '',VariantRequiresShipping: 'FALSE',VariantFulfillmentService: 'manual',VariantTaxable: 'FALSE', ImagePosition: '1'}
      product.link = productLink.href
      product.src = imgs[count].src
      product.alt = imgs[count].alt
      if(prices[count].innerHTML.includes('<')) {
        product.price = prices[count].innerHTML.split('<')[0]
      } else {
        product.price = prices[count].innerHTML
      }

      count++;
      return product
    })
  })

  for(let product of products) {
    await page.goto(product.link)

    const productDescription = await page.$eval('div[class^=ProductMenu-module--product-menu__short-description] p', (element) => {
      return element.innerHTML
    })

    product.description = productDescription

    await page.goBack();
  }

  let csv = "Title,Body (HTML),Handle,Status,Vendor,Product Category,Type,Unit Type,Tags,Published,Variant Grams,Variant Price,Variant Requires Shipping,Variant Fulfillment Service,Variant Taxable,Image Src,Image Position,Image Alt Text,SEO Title\n"

  for(let product of products) {
    csv += `\"${product.alt}\",\"${product.description}\",\"${product.alt.replaceAll(' ', '-').replaceAll(',','')}\",${product.Status},${product.Vendor},${product.ProductCategory},${product.Type},${product.UnitType},${product.Tags},${product.Published},,${product.price},${product.VariantRequiresShipping},${product.VariantFulfillmentService},${product.VariantTaxable},\"${product.src}\",${product.ImagePosition},\"${product.alt}\",\"${product.alt}\"\n`;
  }

  fs.writeFileSync("diabetes_products.csv", csv)

	await browser.close(); 
  
})();