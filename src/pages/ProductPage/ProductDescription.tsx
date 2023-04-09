import * as React from "react";
import { Product } from "../../data/product.types";
import { Typography } from "@mui/material";
import { ProductDescriptionDetail } from "./ProductDescriptionDetail";

export interface IProductDescriptionProps {
  product: Product;
}

export function ProductDescription(props: IProductDescriptionProps) {
  return (
    <React.Fragment>
      <ProductDescriptionDetail label="Карта спецификации" value={props.product.CardUrl} />
      <ProductDescriptionDetail label="Марка" value={props.product.Brand} />
      <ProductDescriptionDetail label="Линия" value={props.product.Line} />
      <ProductDescriptionDetail label="Модел" value={props.product.Model} />
      <ProductDescriptionDetail label="Подходящи индустрии" value={props.product.IndustriesJson} />
      <ProductDescriptionDetail label="Вид обувка" value={props.product.ProductType} />
      <ProductDescriptionDetail label="Цвят" value={props.product.Color} />
      <ProductDescriptionDetail label="Стандарт" value={props.product.Norm} />
      <ProductDescriptionDetail label="Сертификат" value={props.product.Certificate} />
      {/* <ProductDescriptionDetail label="" value={props.product.ProductFeatures} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.ProductCharacteristics} /> */}
      <ProductDescriptionDetail label="Материали - горна част" value={props.product.UpperMaterial} />
      <ProductDescriptionDetail label="Материали - Калъп" value={props.product.LiningAndSock} />
      <ProductDescriptionDetail label="Материали - Подметка (вътрешна)" value={props.product.Insole} />
      <ProductDescriptionDetail label="Материали - Подметка (външна)" value={props.product.Sole} />
      <ProductDescriptionDetail label="Система за обуване" value={props.product.Fastening} />
      {/* <ProductDescriptionDetail label="Размери - при предварителна заявка" value={props.product.SizesOnRequest[0]} /> */}
      <ProductDescriptionDetail label="Тегло" value={props.product.Weight} />
      {/* <ProductDescriptionDetail label="Размери - налични" value={props.product.AvailableSizes[0]} /> */}
      {/* <ProductDescriptionDetail label="XML ID" value={props.product.Id} /> */}
      {/* <ProductDescriptionDetail label="XML Barcodes" value={props.product.ProductVariants.map((x) => x.Barcode)} /> */}
      {/* <ProductDescriptionDetail label="XML Цена в Евро" value={props.product.PriceImportEUR.toString()} /> */}
      {/* <ProductDescriptionDetail label="XML Цена първи вариант в Евро" value={props.product.PriceEUR.toString()} /> */}
      {/* <ProductDescriptionDetail label="XML" value={props.product.PriceBGN} /> */}
      <ProductDescriptionDetail label="Цена (в лева с включено ДДС)" value={props.product.Price.toFixed(2) + " лв."} />
      {/* <ProductDescriptionDetail label="Снимки Shopify" value={props.product.ImageUrlsShopify} /> */}
      {/* <ProductDescriptionDetail label="Снимки (локални файлове)" value={props.product.ImageFilenames} /> */}
      {/* <ProductDescriptionDetail label="Допълнително описание" value={props.product.DescriptionAdditional} /> */}
      {/* <ProductDescriptionDetail label="Свойства - описание" value={props.product.PropertiesDescription} /> */}
      <ProductDescriptionDetail label="Защитни Свойства" value={props.product.Properties} />
      <ProductDescriptionDetail
        label="Защитни свойства - детайлно"
        value={props.product.ProtectiveProperties.map((x) => `${x.Description}-${x.Value}`)}
      />
      <ProductDescriptionDetail label="Защитни свойства - допълнителни" value={props.product.PropertiesAdditional} />

      {/* <ProductDescriptionDetail label="Индустрии" value={props.product.Industries} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.ShoeKind} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.ShoeType} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.LiningMaterial} /> */}
      <ProductDescriptionDetail label="Метод на сглобяване" value={props.product.AssemblyMethod} />
      <ProductDescriptionDetail label="Бомбе" value={props.product.Toe} />
      <ProductDescriptionDetail label="Стандарт за защита" value={props.product.ProtectionCategory} />
      {/* <ProductDescriptionDetail label="" value={props.product.ProtectionStandard} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.Pattern} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.Category} /> */}
      <ProductDescriptionDetail label="Пол" value={props.product.Gender} />
      {/* <ProductDescriptionDetail label="" value={props.product.ShoeConstruction} /> */}
      {/* <ProductDescriptionDetail label="Размери" value={props.product.Sizes.map((x) => x.toString())} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.Categories} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.ENProperties} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.HasXMLData} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.HasJSONData} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.HasUniformPriceAcrossVariants} /> */}
      {/* <ProductDescriptionDetail label="" value={props.product.HasRetailPrice} />  */}
    </React.Fragment>
  );
}
