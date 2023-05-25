<Query Kind="Program">
  <Connection>
    <ID>34afad1f-17b1-404e-8628-b696f11e1a9d</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Driver Assembly="(internal)" PublicKeyToken="no-strong-name">LINQPad.Drivers.EFCore.DynamicDriver</Driver>
    <AttachFileName>E:\SRC\SimplCommerce\src\SimplCommerce.WebHost\Application.db</AttachFileName>
    <DriverData>
      <PreserveNumeric1>True</PreserveNumeric1>
      <EFProvider>Microsoft.EntityFrameworkCore.Sqlite</EFProvider>
    </DriverData>
  </Connection>
</Query>

void Main()
{

	var r = new Localization_Resource
	{
		CultureId = "bg-BG",
		Key = "Order Details",
		Value = "Поръчка"
	}; r.Dump();
	Localization_Resources.InsertOnSubmit(r);
	SubmitChanges();

}

// You can define other methods, fields, classes and namespaces here