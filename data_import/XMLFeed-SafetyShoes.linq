<Query Kind="Program">
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Converters</Namespace>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>Newtonsoft.Json.Serialization</Namespace>
  <Namespace>System.Net</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>System.Net.Http</Namespace>
</Query>

async Task Main()
{
	// en
	//string link = "https://protektor.sai.pl/ux3UM2CfDwVz1lB8YQaVU5WFK/feed.xml";
	//string xmlText = await GetXmlTextFromLink(link);
	var xmlText = File.ReadAllText(@"E:\SRC\simpl2\src\SimplCommerce.WebHost\data_import\catalog_en.xml");
	var xml = XElement.Parse(xmlText);
	
	// bg
	var jsonText = File.ReadAllText(@"E:\SRC\simpl2\src\SimplCommerce.WebHost\data_import\catalog_bg.json");
	JArray jArrayBg = JArray.Parse(jsonText);

	
	//xml.Elements().First().Element("index").Value.Dump();
	//jArrayBg.FirstOrDefault(x => x["Index"].ToString() == "01-000045").Dump();
	
	JArray dtos = new JArray();
	foreach(XElement product in xml.Elements())
	{
		var dto = BuildDto(product, jArrayBg);
		dtos.Add(dto);		
	}
	//dtos.ToString().Dump();

	dtos.First().Dump();
	var httpClient = new System.Net.Http.HttpClient();
	var stringContent = new StringContent(dtos.First().ToString(), Encoding.UTF8, "application/json");
	stringContent.Headers.Add("Cookie", "_ga=GA1.1.1114401922.1668437244; _gid=GA1.1.733225134.1668437244; XSRF-TOKEN=CfDJ8A2tx22oyENGgrmM1aDEgjvtFeMD5Nmeb4c5J6CrdRRvWQwM5yqfGwQG5VAkYCPGWpVNXaB7oNiytwVW9yTKZg46SlBcL9q9Sm3RiGARBdG2ZsWHYQt0dqCMWp7t_YEgFrSs5LyuOndJf6falSOd3BZVpIFB7nR_60s-nlC6ipd8K0mA0zbLceGhiKpfmYsmWw; idsrv.session=IdovOMZLNOIPuuA9BTE7xg; SimplUserGuid=68756b7d-0ac1-4d1a-8bb6-9900d343f831; .AspNetCore.Identity.Application=CfDJ8A2tx22oyENGgrmM1aDEgjvzmEf0spQdWZImpn6GskjkasLCIzxMBc92okrrhBmSmjOzUU0926CXUWJwyDZTOtHi93tBcRpM5vfsj6eQw4O0eFMYqBv_cm8fiVDY4kEf7flDJkyPUAAsWVxNM54wNZg-12qDqg6JNI-OwDxm1DvcQezryW1c3j-9g2FxFVBJd-RQcYx_VI9bxgOIe89tG21wOfyUZBJoAJ6rk-mivmd_mGszo8C3Xve0woToE8r6KREfAOkabUF-6X1I0OSnj5350MqzNu8L9YDO-PSEixrICpxAFxzv2vtbCJiWJ_KKHzaFZgKXSOAGZVW_xLJDSc7715R3gp9MPuWqlMLZKYNhif8_XK5ECLHkoVaAjn1CzPvYD52VAEaIBkIBFpRBBtTND9HKR9mpW_fOCsZ3Zu89MD9HLN6-ZMva1AAknAvKHldMG7xr3PTYo5wa7R4QmOsPQBE8X3miXU0DLCdq5bZIYEAFe8N3pgQALS0eWbBAMaai3yuoI9Cq1kOOktX0-0BEdYANjLNvsPE70T1CSLAyZX0jIas2eV6XpBcVOhgA6BFfLWGSmuvpdomro8IEJUHJulGClCX1vLcZHGDyAPE0K-Rl9vsNyEMy6epvlkHLD7GNQLHgSIEqCmD2en1P0mHYreOSYNvnCZkRnKIW32e13MJgUqs8wJv7Gpty88sxr7r5HaV28uLOW82jC64nIXCQcRYWQMALNrmfA7ExyPbY07cDRiT3quNrlnZfjTrU_iO0Pz5ptp7E9mJlY3X3-NYKA2pt5WdPSPB9ymIKDDen9awX-iJwGcAZmIwYUkFElRZy3jWt3J4SOXaUaqFdJPOhYHl7ssYrxDVYkZl_-1lmPuPvJ1tWiUNmDlEEXKyiOyiNf4f7kwWtekNmouUs1p2rkYA8YgSzgr7Lt3I7QyeFGlygXffc49nf3SdQqzcgFrsq2IvVtBqoyaR-aGz3o1HJk2FDfrBafgEHJeP7nvf9i18y4UNlcq4qO3ECo_zxv-_KJETbhiBfc93PFd4zkp0Tnrt6HoI4e1TLPYajus_x; .AspNetCore.Antiforgery.ueBXTwJhuQM=CfDJ8A2tx22oyENGgrmM1aDEgjuUuDENyHzpxzJasrWPoqjOG_98MLsEtIE53m4q4Wd2rr4llT0XXjeaSRFpPwVeFC2rBShAEM3uZJMam01LOwrNZcncCq2tpun_F2bghJ8cxx-_2RiZb_7NulBqP0FGt98; XSRF-TOKEN=CfDJ8A2tx22oyENGgrmM1aDEgjvtFeMD5Nmeb4c5J6CrdRRvWQwM5yqfGwQG5VAkYCPGWpVNXaB7oNiytwVW9yTKZg46SlBcL9q9Sm3RiGARBdG2ZsWHYQt0dqCMWp7t_YEgFrSs5LyuOndJf6falSOd3BZVpIFB7nR_60s-nlC6ipd8K0mA0zbLceGhiKpfmYsmWw");
	var postResult = await httpClient.PostAsync("https://localhost:5001/api/products", stringContent);
	postResult.Dump();

	//json.First()["Name"].Dump();
	//foreach (JObject jObj in json) // works
	//{
	//	jObj["Name"].Dump();
	//}
	
	//XElement p = xml.Elements().First();
	//p.Element("name").Value.Dump(); // works
	
	//foreach(XElement product in xml.Elements()) // works
	//{
	//	Console.WriteLine(
	//		product.Element("name").Value
	//	);
	//}
}

JObject BuildDto(XElement product, JArray json)
{
	var productJobj = new JObject();
	var jObj = json.FirstOrDefault(j => j["Index"].ToString() == product.Element("index").Value);
	productJobj["slug"] = product.Element("index").Value;
	productJobj["name"] = jObj["Internal name"].Value<string>() ?? product.Element("name").Value;
	productJobj["description"] = jObj["Description"].Value<string>() ?? product.Element("description").Value;
	
	JObject result = new JObject();
	result["Product"] = productJobj;
	
	return result;
}

class Product
{
	public string Name { get; set; }
	public string Description { get; set; }
	public string Slug { get; set; }
}

async Task<string> GetXmlTextFromLink(string link = "https://protektor.sai.pl/ux3UM2CfDwVz1lB8YQaVU5WFK/feed.xml")
{
	var httpClient = new System.Net.Http.HttpClient();
	//Task<string> xmlTextTask = httpClient.GetStringAsync(link);
	//return xmlTextTask.Result;
	
	string xmlText = await httpClient.GetStringAsync(link);
	return xmlText;
}