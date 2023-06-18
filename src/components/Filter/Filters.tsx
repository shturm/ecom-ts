import * as React from "react";
import { Filter } from "./Filter";
import { Grid, TextField } from "@mui/material";
import { Product } from "../../data/product.types";
import _, { filter } from "lodash";
import { ProtectionCategory } from "../../pages/ProtectionCategory";

export interface IFiltersProps {
  products: Product[];
  onChange: (filters: IFilters) => void;
}

export interface IFilters {
  Brands: string[];
  Sizes: string[];
  ProtectionCategories: string[];
  Models: string[];
  ProductTypes: string[];
  SearchTerm: string;
}

export const filterProducts = (products: Product[], filters: IFilters) => {
  const allSizes = _.uniq(products.map((x) => x.Sizes).flat()).map((x) =>
    x.toString()
  );
  const allBrands = _.uniq(products.map((x) => x.Brand));
  const allModels = _.uniq(products.map((x) => x.Model));
  const allProtectionCategories = _.uniq(
    products.map((x) => x.ProtectionCategory)
  );
  const allProductTypes = _.uniq(products.map((x) => x.ProductType));

  let result = products;
  if (filters.Brands.length > 0) {
    result = result.filter((x) => filters.Brands.includes(x.Brand));
  }

  if (filters.Models.length > 0) {
    result = result.filter((x) => filters.Models.includes(x.Model));
  }

  if (filters.Sizes.length > 0) {
    result = result.filter(
      (x) => _.intersection(filters.Sizes, allSizes).length > 0
    );
  }

  if (filters.ProtectionCategories.length > 0) {
    result = result.filter((x) =>
      filters.ProtectionCategories.includes(x.ProtectionCategory)
    );
  }

  if (filters.ProductTypes.length > 0) {
    result = result.filter((x) => filters.ProductTypes.includes(x.ProductType));
  }

  if (filters.SearchTerm) {
    console.log(`count before searchTerm ${result.length}`);
    result = result.filter(
      (x) => x.InternalName.toLowerCase().includes(filters.SearchTerm) || 
        x.ProductType.toLowerCase().includes(filters.SearchTerm) ||
        x.Index.toLowerCase().includes(filters.SearchTerm) ||
        x.Brand.toLowerCase().includes(filters.SearchTerm) ||
        x.Line.toLowerCase().includes(filters.SearchTerm) ||
        x.Model.toLowerCase().includes(filters.SearchTerm) ||
        x.Norm.toLowerCase().includes(filters.SearchTerm) ||
        x.Certificate.toLowerCase().includes(filters.SearchTerm) ||
        x.AssemblyMethod.toLowerCase().includes(filters.SearchTerm) ||
        x.Toe.toLowerCase().includes(filters.SearchTerm) ||
        x.Gender.toLowerCase().includes(filters.SearchTerm)
    );
    console.log(`count after searchTerm ${result.length}`);
  }

  // const filteredByBrands = filters.Brands.length > 0 ? products.filter((x) => _.intersection(filters.Brands, allBrands).length > 0) : products;
  // const thenBySizes = filters.Sizes.length > 0 ? filteredByBrands.filter((x) => _.intersection(filters.Sizes, allSizes).length > 0) : filteredByBrands;
  // const thenByProtectionCategories = filters.ProtectionCategories.length > 0 ? thenBySizes.filter((x) => _.intersection(filters.ProtectionCategories, allProtectionCategories)) : thenBySizes;

  return result;
  // return products.slice();
};

export function Filters(props: IFiltersProps) {
  const [brand, setBrand] = React.useState<string[]>([]);
  const [model, setModel] = React.useState<string[]>([]);
  const [size, setSize] = React.useState<string[]>([]);
  const [protectionCategory, setProtectioncategory] = React.useState<string[]>(
    []
  );
  const [productType, setProductType] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    props.onChange({
      Brands: brand,
      Models: model,
      Sizes: size,
      ProtectionCategories: protectionCategory,
      ProductTypes: productType,
      SearchTerm: searchTerm
    });
  }, [brand, model, size, protectionCategory, productType, searchTerm]);

  const onBrandChange = (value: string[]) => {
    setBrand(value);
    // console.log("Brand changed to", value);
  };
  const onSizeChange = (value: string[]) => {
    setSize(value);
    // console.log("Size changed to", value);
  };
  const onProtectionCategoryChange = (value: string[]) => {
    setProtectioncategory(value);
    // console.log("Protection changed to", value);
  };

  const onModelChange = (value: string[]) => {
    setModel(value);
    // console.log("Model changed to", value);
  };

  const onProductTypeChange = (value: string[]) => {
    setProductType(value);
    // console.log("Model changed to", value);
  };

  const onSearchTermChange = (value: string) => {
    setSearchTerm(value);
    // console.log("Model changed to", value);
  };

  const brands = _.uniq(props.products.map((x) => x.Brand)).map((x) => {
    return x;
  });
  const models = _.uniq(props.products.map((x) => x.Model)).sort((a, b) =>
    b.localeCompare(a)
  );

  const sizes: string[] = (() => {
    let unflat = props.products.map((x) => x.Sizes);
    let flat = unflat.flat();
    let uniq = _.uniq(flat);
    let sorted = uniq.sort((a, b) => a - b);
    let asStrings: Array<string> = sorted.map((x) => x.toString());
    return asStrings;
  })();

  const protectionCategories = _.uniq(
    props.products.map((x) => x.ProtectionCategory)
  ).sort((a, b) => b.localeCompare(a));

  const productTypes = _.uniq(props.products.map((x) => x.ProductType)).sort(
    (a, b) => b.localeCompare(a)
  );

  return (
    <React.Fragment>
      <TextField
        label="Търсене"
        variant="outlined"
        placeholder="01-010924, unique hero, боти..."
        fullWidth
        // value={searchTerm}
        size="medium"
        onChange={(e) => onSearchTermChange(e.target.value.toLowerCase())}
        sx={{
          mt: 2,
        }}
      />
      <Grid container mt={2}>
        <Filter items={brands} label="Марка" onChangeCallback={onBrandChange} />
        {/* <Filter items={sizes} label="Размер" onChangeCallback={onSizeChange} /> */}
        <Filter items={models} label="Модел" onChangeCallback={onModelChange} />
        <Filter
          items={protectionCategories}
          label="Стандарт"
          onChangeCallback={onProtectionCategoryChange}
        />
        <Filter
          items={productTypes}
          label="Вид обувка"
          onChangeCallback={onProductTypeChange}
        />
      </Grid>
    </React.Fragment>
  );
}
