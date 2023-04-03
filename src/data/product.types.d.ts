export interface Product {
    Index:                         string;
    Name:                          string;
    TradeName:                     string;
    InternalName:                  string;
    CardUrl:                       string;
    Description:                   string;
    Line:                          string;
    Brand:                         string;
    IndustriesJson:                string[];
    ProductType:                   string;
    Color:                         string;
    Norm:                          string;
    Certificate:                   string;
    ProductFeatures:               string[];
    ProductCharacteristics:        string[];
    UpperMaterial:                 string[];
    LiningAndSock:                 string[];
    Insole:                        string[];
    Sole:                          string[];
    Fastening:                     string[];
    SizesOnRequest:                string[];
    Weight:                        string;
    AvailableSizes:                string[];
    Id:                            string;
    ProductVariants:               ProductVariant[];
    PriceImportEUR:                number;
    PriceEUR:                      number;
    PriceBGN:                      number;
    Price:                         number;
    ImageUrlsShopify:              string[];
    ImageFilenames:                string[];
    DescriptionAdditional:         string;
    PropertiesDescription:         string;
    Properties:                    string[];
    ProtectiveProperties:          ProtectiveProperty[];
    PropertiesAdditional:          string[];
    Industries:                    string[];
    ShoeKind:                      string;
    ShoeType:                      string;
    Model:                         string;
    LiningMaterial:                string;
    AssemblyMethod:                string;
    Toe:                           string;
    ProtectionCategory:            string;
    ProtectionStandard:            string;
    Pattern:                       string;
    Category:                      string;
    Gender:                        string;
    ShoeConstruction:              string;
    Sizes:                         number[];
    Categories:                    Category[];
    ENProperties:                  any[];
    HasXMLData:                    boolean;
    HasJSONData:                   boolean;
    HasUniformPriceAcrossVariants: boolean;
    HasRetailPrice:                boolean;
}

export interface Category {
    Name:     string;
    Children: Category[];
}

export interface ProductVariant {
    Barcode:      string;
    Currency:     Currency;
    Price:        number;
    ProductIndex: string;
    Size:         string;
}

export enum Currency {
    Eur = "EUR",
}

export interface ProtectiveProperty {
    Description: string;
    Value:       string;
}
