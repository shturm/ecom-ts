<Query Kind="Program">
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
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>System.Security.Policy</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
</Query>

void Main()
{
	string outputPath = @"E:\SRC\ecom\src\data\products_new.json";
	JArray json = JArray.Parse(File.ReadAllText(@"E:\SRC\ecom\data_import\catalog_bg.json"));
	JArray jsonWPrices = JArray.Parse(File.ReadAllText(@"E:\SRC\ecom\data_import\catalog_prices.json"));
	//XElement xml = XElement.Parse(File.ReadAllText(@"E:\SRC\ecom\data_import\catalog_en.xml"));
	XElement xml = XElement.Parse(File.ReadAllText(@"E:\SRC\ecom\data_import\catalog_en2.xml"));

	List<Product> eligibleProducts = ReadProducts(json, xml, jsonWPrices);
	eligibleProducts.Select(p => new {
		p.Id,
		p.Index,
		p.InternalName,
		p.Sizes,
		p.Price,
		p.IndustriesJson,
		p.Categories
	})
	.OrderByDescending(p => p.IndustriesJson.Count());
	$"Eligible products count: {eligibleProducts.Count()}".Dump();
	//.Dump("Subset of props");

	//var formatting = new Newtonsoft.Json.Formatting() {	};
	string productsJson = JsonConvert.SerializeObject(eligibleProducts, Newtonsoft.Json.Formatting.Indented);
	File.WriteAllText(outputPath, productsJson);
	$"Written output to {outputPath}".Dump();
	
	//var cats = ExtractCategories(eligibleProducts);
	//cats.Dump("Categories");

}

// Universal Product read

List<Product> ReadProducts (JArray json, XElement xml, JArray jsonWPrices, bool dumpReporting = false)
{
	List<Product> products = new List<UserQuery.Product>();
	
	// JSON (from XLSX file)
	foreach (var jsonProduct in json)
	{
		var p = new Product();
		p.Index = jsonProduct["Index"].ToString();
		p.Name = jsonProduct["Name"].ToString();
		p.InternalName = jsonProduct["Internal name"].ToString();
		p.TradeName= jsonProduct["Trade name"].ToString();
		p.CardUrl = jsonProduct["CARD"].ToString();
		p.Description = jsonProduct["Description"].ToString();
		p.Line = jsonProduct["Line"].ToString().ToUpper();
		p.Brand = jsonProduct["Brand"].ToString().ToUpper();
		p.IndustriesJson = jsonProduct["Industry"].ToString().Split(",").Select(i => i.Trim().ToUpper()).ToList();
		p.ProductType = jsonProduct["Product type"].ToString();
		p.Color = jsonProduct["Color"].ToString();
		p.Norm = jsonProduct["Norm"].ToString();
		p.Certificate = jsonProduct["Certificate"].ToString();
		p.ProductFeatures = jsonProduct["Certificate"].ToString().Split(",").Select(x => x.Trim()).ToList();
		p.ProductCharacteristics = jsonProduct["Product characteristics"].ToString().Split(",").Select(x => x.Trim()).ToList();
		p.UpperMaterial = jsonProduct["Upper material"].ToString().Split(",").Select(x => x.Trim()).ToList();;
		p.LiningAndSock = jsonProduct["Lining & Sock"].ToString().Split(",").Select(x => x.Trim()).ToList();;
		p.Insole = jsonProduct["Insole"].ToString().Split(",").Select(x => x.Trim()).ToList();;
		p.Sole = jsonProduct["Sole"].ToString().Split(",").Select(x => x.Trim()).ToList();;
		p.Fastening = jsonProduct["Fastening"].ToString().Split(",").Select(x => x.Trim()).ToList();;
		p.SizesOnRequest = jsonProduct["Sizes on request"].ToString().Split("  ").Select(x => x.Trim()).ToList();
		p.Weight = jsonProduct["Weight"].ToString();
		p.AvailableSizes = jsonProduct["Available sizes"].ToString().Split("  ").Select(x => x.Trim()).ToList();

		p.HasJSONData = true;


		//p.Name.Dump();
		products.Add(p);
	}
	
	// XML
	foreach (XElement e in xml.Elements())
	{
		var p = products.FirstOrDefault(pr => pr.Index == e.Element("index").Value);

		//$"Adding XML data to JSON product #index:{p.Index}".Dump();
		if (p == null)
		{
			p = new Product();
			if (dumpReporting) $"XML product #id:{e.Element("id").Value} has no JSON/XLSX record".Dump();
		}

		p.Id = e.Element("id").Value;

		p.ProductVariants = e.Element("variants").Elements()
			.Select(x => new ProductVariant()
			{
				Barcode = x.Attribute("barcode")?.Value,
				Currency = x.Attribute("currency").Value,
				Price = Double.Parse(x.Attribute("net_price").Value.Replace(".", ",")),
				ProductIndex = x.Attribute("product_index").Value,
				Size = x.Attribute("size").Value,
			})
			.ToList();

		p.ImageUrlsShopify = e.Element("images").Elements()
			.Select(x => x.Attribute("url").Value)
			.ToList();

		p.DescriptionAdditional = e.Element("additional_description").Value;

		if (string.IsNullOrEmpty(p.Description))
		{
			p.Description = e.Element("description").Value;
			p.ENProperties.Add("Description");
		}

		p.Properties = e.Element("properties").Elements()
			.Select(x => x.Attribute("value").Value)
			.ToList();

		p.PropertiesDescription = e.Element("properties_description").Value;

		p.ProtectiveProperties = e.Element("protective_properties").Elements()
			.Select(x => new PropertyProtective()
			{
				Description = x.Attribute("description").Value,
				Value = x.Attribute("value").Value,
			})
			.ToList();

		p.PropertiesAdditional = e.Element("additional_properties").Elements()
			.Select(x => x.Attribute("value").Value)
			.ToList();

		p.Industries = e.Element("industries").Elements()
			.Select(x => x.Attribute("value").Value)
			.ToList();

		p.ShoeKind = e.Element("shoe_kind").Value;
		p.ShoeType = e.Element("shoe_type").Value;
		p.Model = e.Element("model").Value;
		p.LiningMaterial = e.Element("lining_material").Value;
		p.AssemblyMethod = e.Element("assembly_method").Value;
		p.Toe = e.Element("toe").Value;
		p.ProtectionCategory = e.Element("protection_category").Value;
		p.ProtectionStandard = e.Element("protection_standard").Value;
		p.Pattern = e.Element("pattern").Value;
		p.Category = e.Element("category").Value;
		p.Gender = e.Element("gender").Value;
		p.ShoeConstruction = e.Element("shoe_construction").Value;
		p.Sizes = p.ProductVariants.Select(pv => Int32.Parse(pv.Size.Substring(0,2))).OrderBy(pv => pv).ToList();

		p.HasXMLData = true;

	}

	foreach (var jsonProductWPrice in jsonWPrices)
	{
		var index = jsonProductWPrice["Index"].ToString();
		var product = products.SingleOrDefault(x=>x.Index == index);
		if (product == null) 
		{
			if (dumpReporting) $"[Index]#{index} has a price, but no existing product".Dump();
			continue;
		}
		
		product.PriceEUR = Double.Parse(jsonProductWPrice["SUGGESTED RETAIL PRICE EURO"].ToString());
		product.HasRetailPrice = true;
	}
	
	//products = products.Where(p => p.Price > 0).ToList();
	products = products.Where(x => x.HasRetailPrice).ToList();
	
	foreach (var p in products) p.UpdateCategories(); // to extract categories later
	
	return products;
}

List<Category> ExtractCategories(List<Product> products)
{
	List<Category> result = new();
	
	foreach (var category in products.SelectMany(x=>x.Categories))
	{
		if (result.Any(r => r.Name == category.Name)) continue;
		result.Add(new Category() {
			Name = category.Name,
			Children = products
							.SelectMany(p => p.Categories)
							.Where(c => c.Name == category.Name)
							.SelectMany(c => c.Children)
							.DistinctBy(c => c.Name)
							.ToList()
		});
	}
	
	return result;
}

class Product
{
	public Product()
	{
		ProductFeatures = new List<string>() {"Друго"};
		ProductCharacteristics = new List<string>(){"Друго"};
		SizesOnRequest = new List<string>(){"Друго"};
		AvailableSizes = new List<string>(){"Друго"};
		UpperMaterial = new List<string>(){"Друго"};
		LiningAndSock = new List<string>(){"Друго"};
		Insole = new List<string>(){"Друго"};
		Sole = new List<string>(){"Друго"};
		Fastening = new List<string>(){"Друго"};

		ProductVariants = new ();
		ImageUrlsShopify = new List<string>();
		Properties = new List<string>();
		ProtectiveProperties = new List<PropertyProtective>();
		PropertiesAdditional = new List<string>();
		Industries = new List<string>();
		Sizes = new List<int>();

		Categories = new();

		ENProperties = new List<string>();
		HasXMLData = false;
		HasJSONData = false;
	}

	public string Index { get; set; }
	public string Name { get; set; }
	public string TradeName { get; set; }
	public string InternalName { get; set; }
	public string CardUrl { get; set; }
	public string Description { get; set; }
	public string Line { get; set; } = "Друго";
	public string Brand { get; set; } = "Друго";
	public List<string> IndustriesJson { get; set; }
	public string ProductType { get; set; } = "Друго";
	public string Color { get; set; } = "Друго";
	public string Norm { get; set; } = "Без ISO";
	public string Certificate { get; set; } = "Без сертификат";
	public List<string> ProductFeatures { get; set; }
	public List<string> ProductCharacteristics { get; set; }
	public List<string> UpperMaterial { get; set; }
	public List<string> LiningAndSock { get; set; }
	public List<string> Insole { get; set; }
	public List<string> Sole { get; set; }
	public List<string> Fastening { get; set; }
	public List<string> SizesOnRequest { get; set; }
	public string Weight { get; set; } = "Друго";
	public List<string> AvailableSizes { get; set; }

	public string Id { get; set; }
	public List<ProductVariant> ProductVariants { get; set; }
	public Double PriceImportEUR
	{
		get => ProductVariants.FirstOrDefault()?.Price ?? 0;
	}
	public Double PriceEUR { get; set;}
	public Double PriceBGN
	{
		get => PriceEUR * 1.96;
	}

	public Double Price
	{
		get => Math.Round(PriceBGN, 2);
	}

	public List<string> ImageUrlsShopify { get; set; }
	public List<string> ImageFilenames { get => ImageUrlsShopify.Select(ius => Path.GetFileName(ius).Split("?").First()).ToList(); }
	public string DescriptionAdditional { get; set; }
	public string PropertiesDescription { get; set; }
	public List<string> Properties { get; set; }
	public List<PropertyProtective> ProtectiveProperties { get; set; }
	public List<string> PropertiesAdditional { get; set; }
	public List<string> Industries { get; set; }
	public string ShoeKind { get; set; }
	public string ShoeType { get; set; }
	public string Model { get; set; }
	public string LiningMaterial { get; set; }
	public string AssemblyMethod { get; set; }
	public string Toe { get; set; }
	public string ProtectionCategory { get; set; }
	public string ProtectionStandard { get; set; }
	public string Pattern { get; set; }
	public string Category { get; set; }
	public string Gender { get; set; }
	public string ShoeConstruction { get; set; }
	public List<int> Sizes { get; set; }

	public List<Category> Categories { get; set; }

	public List<string> ENProperties { get; set; }
	public bool HasXMLData { get; set; }
	public bool HasJSONData { get; set; }
	public bool HasUniformPriceAcrossVariants {
		get => ProductVariants.Max(pv => pv.Price) == ProductVariants.Min(pv => pv.Price);
	}
	public bool HasRetailPrice {get;set;} = false;

	public void UpdateCategories()
	{
		// industries
		Categories.Add(new Category()
		{
			Name = "ИНДУСТРИИ",
			Children = this.IndustriesJson.Select(ij => new Category()
			{
				Name = ij.ToUpper()
			}).ToList()
		});

		// product features
		Categories.Add(new Category()
		{
			Name = "СВОЙСТВА",
			Children = this.ProductFeatures.Select(ij => new Category()
			{
				Name = ij.ToUpper()
			}).ToList()
		});

		// upper material
		Categories.Add(new Category()
		{
			Name = "ГОРНА ЧАСТ",
			Children = this.UpperMaterial.Select(x => new Category()
			{
				Name = x.ToUpper()
			}).ToList()
		});

		// Lining and Sock
		Categories.Add(new Category()
		{
			Name = "ВЪТРЕШНА ЧАСТ",
			Children = this.LiningAndSock.Select(x => new Category()
			{
				Name = x.ToUpper()
			}).ToList()
		});

		// Insole
		Categories.Add(new Category()
		{
			Name = "ВЪТРЕШНА ПОДМЕТКА",
			Children = this.Insole.Select(x => new Category()
			{
				Name = x.ToUpper()
			}).ToList()
		});

		// Sole
		Categories.Add(new Category()
		{
			Name = "ВЪНШНА ПОДМЕТКА",
			Children = this.Sole.Select(x => new Category()
			{
				Name = x.ToUpper()
			}).ToList()
		});

		// Fastening
		Categories.Add(new Category()
		{
			Name = "ЗАТЯГАНЕ",
			Children = this.Fastening.Select(x => new Category()
			{
				Name = x.ToUpper()
			}).ToList()
		});


		// ProductType
		Categories.Add(new Category()
		{
			Name = "ВИД ОБУВКА",
			Children = new List<Category>() { new Category() { Name = this.ProductType } }
		});

		// Sizes
		Categories.Add(new Category()
		{
			Name = "РАЗМЕР",
			Children = this.Sizes.Select(x => new Category()
			{
				Name = x.ToString()
			}).ToList()
		});


	}
}

class Category
{
	public Category()
	{
		Children = new();
	}
	public string Name { get; set; }
	public List<Category> Children { get; set; }
}

class PropertyProtective
{
	public string Description { get; set; }
	public string Value { get; set; }
}

class ProductVariant {
	public string Barcode { get; set; }
	public string Currency { get; set; }
	public Double Price { get; set; }
	public string ProductIndex { get; set; }
	public string Size { get; set; }
}
// /Universal Product read