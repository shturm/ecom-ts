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
  <Output>DataGrids</Output>
</Query>

void Main()
{
	Core_AppSettings.Take(100).Dump();
	
	foreach (var setting in Core_AppSettings.Take(100))
	{
		if (setting.Value == "en-US") {
			setting.Value = "bg-BG";
		}
	}
	SubmitChanges();
	
}

// You can define other methods, fields, classes and namespaces here