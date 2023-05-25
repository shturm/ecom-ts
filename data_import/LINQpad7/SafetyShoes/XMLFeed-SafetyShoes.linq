<Query Kind="Program">
  <Namespace>System.Net</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
</Query>

async Task Main()
{
	string link = "https://protektor.sai.pl/ux3UM2CfDwVz1lB8YQaVU5WFK/feed.xml";
	string xmlText = await GetXmlTextFromLink(link);
	//var xmlText = File.ReadAllText(@"C:\Users\alex\Desktop\feed.xml");
	var xml = XElement.Parse(xmlText);
	
	XElement p = xml.Elements().First();
	p.Element("name").Value.Dump(); // works
	//foreach(XElement product in xml.Elements()) // works
	//{
	//	Console.WriteLine(
	//		product.Element("name").Value
	//	);
	//}
}

// You can define other methods, fields, classes and namespaces here
async Task<string> GetXmlTextFromLink(string link = "https://protektor.sai.pl/ux3UM2CfDwVz1lB8YQaVU5WFK/feed.xml")
{
	var httpClient = new System.Net.Http.HttpClient();
	//Task<string> xmlTextTask = httpClient.GetStringAsync(link);
	//return xmlTextTask.Result;
	
	string xmlText = await httpClient.GetStringAsync(link);
	return xmlText;
}