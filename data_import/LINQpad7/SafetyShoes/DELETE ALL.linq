<Query Kind="SQL">
  <Connection>
    <ID>34afad1f-17b1-404e-8628-b696f11e1a9d</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Driver Assembly="(internal)" PublicKeyToken="no-strong-name">LINQPad.Drivers.EFCore.DynamicDriver</Driver>
    <AttachFileName>E:\SRC\simpl2\src\SimplCommerce.WebHost\Store.db</AttachFileName>
    <DriverData>
      <PreserveNumeric1>True</PreserveNumeric1>
      <EFProvider>Microsoft.EntityFrameworkCore.Sqlite</EFProvider>
    </DriverData>
  </Connection>
  <Output>DataGrids</Output>
</Query>

pragma foreign_keys =0;
delete from Catalog_Category;
delete from Core_Entity;
delete from Catalog_ProductCategory;
delete from Catalog_Product;
delete from Catalog_ProductMedia;
delete from Core_Media;