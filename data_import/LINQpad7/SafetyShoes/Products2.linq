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
  <NuGetReference>Newtonsoft.Json</NuGetReference>
  <Namespace>Newtonsoft.Json.Linq</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>System.Net.Http</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>System.Globalization</Namespace>
</Query>

static JArray json = JArray.Parse(File.ReadAllText(@"E:\SRC\simpl2\src\SimplCommerce.WebHost\data_import\catalog_bg.json"));
static XElement xml = XElement.Parse(File.ReadAllText(@"E:\SRC\simpl2\src\SimplCommerce.WebHost\data_import\catalog_en.xml"));
JArray jsonWPrices = JArray.Parse(File.ReadAllText(@"E:\SRC\simpl2\src\SimplCommerce.WebHost\data_import\catalog_prices.json"));

static string imageDir = @"E:\SRC\simpl2\src\SimplCommerce.WebHost\wwwroot\user-content\";
//static Dictionary<Type,long> pks = new Dictionary<System.Type, long>();

void Main()
{
	//DownloadFile("https://cdn.shopify.com/s/files/1/0555/9694/1509/products/cf503c1b12f5482e82d55a068c739523_3898a9e3-f61b-409c-b0b4-e84d1a6854b6.jpg?v=1650609538").Dump();
	//CreateAllCategoriesFromIndustries();
	//CreateAllProducts();
	CreateAllProducts2();

	//xml.Elements().First()
	//	.Element("images").Elements()
	//	.Select(x => x.Attribute("url").Value)
	//	.Dump();
}

void CreateAllProducts2()
{
	var allProducts = ReadProducts(json, xml, jsonWPrices);
	var allCategories = ExtractCategories(allProducts);
	var allBrands = allProducts.Select(p => p.Brand).Distinct().ToList();

	var catalog_categories = CreateCatalogCategories();
	Catalog_Categories.AddRange(catalog_categories);
	
	
	SaveChanges();
	
	List<Core_Media> CreateImages()
	{
		var result = new List<Core_Media>();
		
		return null;
	}
	
	List<Catalog_Category> CreateCatalogCategories()
	{
		var cid = Catalog_Categories.Any() ? Catalog_Categories.Max(cc => cc.Id) : 1;
		
		var result = new List<Catalog_Category>();
		foreach (var p in allCategories)
		{
			var parent = new Catalog_Category()
			{
				Id=cid++,
				Name = p.Name,
				IsPublished = 1,
				IsDeleted = 0,
				Children = new List<Catalog_Category>(),
				Slug = Slug(p.Name)
			};

			//parent.Children.AddRange(
			//	p.Children.Select(c => new Catalog_Category()
			//	{
			//		Id = cid++,
			//		ParentId = parent.Id,
			//		Name = c.Name,
			//		IsPublished = 1,
			//		IsDeleted = 0,
			//		Children = null,
			//		Slug = Slug(c.Name),
			//		Parent = parent
			//	}).ToList()
			//);

			var children = p.Children.Select(c => new Catalog_Category() {
				Id=cid++,
				ParentId=parent.Id,
				Name= c.Name,
				IsPublished=1,
				IsDeleted=0,
				Children=null,
				Slug=Slug(c.Name),
				Parent=parent
			}).ToList();
			
			parent.Children = children;
			result.Add(parent);
			result.AddRange(children);
			
		}
		
		foreach (var childName in allCategories.SelectMany(x=>x.Children).DistinctBy(x=>x.Name))
		{
			
		}
		return result;
	}

	List<Catalog_Brand> CreateBrands()
	{
		return null;
	}
}

void CreateAllProducts()
{
	long p_id = Catalog_Products.Any() ? Catalog_Products.Max(x=>x.Id) + 1: 1;
	long e_id = Core_Entities.Any() ? Core_Entities.Max(x=>x.Id) + 1: 1;
	long pc_id = Catalog_ProductCategories.Any() ? Catalog_ProductCategories.Max(x=>x.Id) + 1: 1;
	long pm_id = Catalog_ProductMedias.Any() ? Catalog_ProductMedias.Max(x=>x.Id) + 1: 1;
	long m_id = Core_Medias.Any() ? Core_Medias.Max(x=>x.Id) + 1: 1;
	
	var allProducts = ReadProducts(json, xml, jsonWPrices);
	var allCategories = ExtractCategories(allProducts);
	var allBrands = allProducts.Select(p => p.Brand).Distinct().ToList();
	

	foreach (var jsonProduct in json)
	{
		if (Catalog_Products.Any(cp => cp.Sku == jsonProduct["Index"].ToString())) continue;
		var up = allProducts.FirstOrDefault(up => up.Index == jsonProduct["Index"].ToString());
		if (up == null) continue;

		List<Catalog_ProductCategory> productCategories = new();
		foreach (var parent in up.Categories)
		{
			foreach (var child in parent.Children)
			{
				productCategories.Add(new Catalog_ProductCategory()
				{
					Id = pc_id++,
					Category = CreateOrGetCategory(child.Name, parent.Name),
					IsFeaturedProduct = 1,
				});
			}

			productCategories.Add(new Catalog_ProductCategory()
			{
				Id = pc_id++,
				Category = Catalog_Categories.FirstOrDefault(x => x.Name == parent.Name),
				IsFeaturedProduct = 1,
			});

		}
		
		List<Catalog_ProductMedia> images = xml.Elements().FirstOrDefault(x => x.Element("index").Value == jsonProduct["Index"].ToString())?
			.Element("images").Elements()
			.Select(x => x.Attribute("url").Value)
			.Select(x => DownloadFile(x).Result)
			.Select(x => new Catalog_ProductMedia()
			{
				Id = pm_id++,
				Media = new Core_Media()
				{
					Id = m_id++,
					FileName = x,
					MediaType = 1,
				}
			}).ToList();

		string priceStringBGN = "1.00";
		try
		{
			XElement xmlProduct = xml.Elements().FirstOrDefault(x => x.Element("index").Value == jsonProduct["Index"].ToString());
			string priceStringEUR = xmlProduct.Element("variants").Elements().FirstOrDefault().Attribute("net_price").Value;
			priceStringBGN = (double.Parse(priceStringEUR, CultureInfo.InvariantCulture) * 1.96d).ToString();
		}
		catch (Exception ex)
		{
			$"Could not set price for product {jsonProduct["Index"].ToString()}".Dump();
		}

		var product = new Catalog_Product()
		{
			Id = p_id++,
			Name = jsonProduct["Internal name"].ToString(),
			Slug = jsonProduct["Internal name"].ToString().ToLower().Replace(" ", "-"),
			Sku = jsonProduct["Index"].ToString(),
			IsPublished = 1,
			IsFeatured = 1,
			IsVisibleIndividually = 1,
			IsAllowToOrder = 1,
			CreatedOn = "1304750238764851200", //DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(),
			LatestUpdatedOn = "1304750238764851200", //DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(),
													 //CreatedOn = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd hh:mm:ss"),
													 //LatestUpdatedOn = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd hh:mm:ss"),
			Price = priceStringBGN,
			CreatedBy = Core_Users.First(),
			LatestUpdatedBy = Core_Users.First(),
			//Brand = getBrand(jsonProduct["Brand"].ToString()),
			Brand = CreateOrGetBrand(jsonProduct["Brand"].ToString()),
			TaxClass = getTaxClass("Standard"),
			ThumbnailImage = images?.FirstOrDefault().Media,
			//ProductCatalog_ProductCategories = catByIndustry,
			ProductCatalog_ProductCategories = productCategories,
			ProductCatalog_ProductMedias = images
		};
		Catalog_Products.Add(product);
		var entity = new Core_Entity()
		{
			Id = Core_Entities.Any() ? Core_Entities.Max(x => x.Id) + 1 : 1,
			//Id=e_id++,
			EntityId = product.Id,
			Name = product.Name,
			Slug = product.Slug,
			EntityTypeId = "Product"
		};
		Core_Entities.Add(entity);

		SaveChanges();
		product.Sku.Dump();
		//p_id++;
		//e_id++;
		//
	} // foreach jsonProduct


}

string GetProductStandard(string productName)
{
	List<string> standards = new() { "SI", "SIP", "S2", "S3", "F2A" };
	foreach (var standard in standards)
	{
		if (productName.Contains(standard)) return standard;
	}
	return "Обувки без защита";
}

async Task<string> DownloadFile(string link)
{
	string filename=link.Split("/").Last().Split("?").First();
	string filePath=$"{imageDir}{filename}";
	if (File.Exists(filePath)) return filename;
	
	var uri = new Uri(link);
	HttpClient client = new HttpClient();
	var response = await client.GetAsync(uri);
	using (var fs = new System.IO.FileStream(filePath, FileMode.CreateNew))
	{
		await response.Content.CopyToAsync(fs);
	}
	return filename;
}
Catalog_Category CreateOrGetCategory(string name, string parentName)
{
	var category = Catalog_Categories.FirstOrDefault(cc => cc.Name == name);
	if (category != null) return category;

	long cat_id = Catalog_Categories.Any() ? Catalog_Categories.Max(cc => cc.Id) + 1 : 1;
	long ent_id = Core_Entities.Any() ? Core_Entities.Max(cc => cc.Id) + 1 : 1;
	
	var parent = Catalog_Categories.FirstOrDefault(cc => cc.Name == parentName);
	if (parent == null)
	{
		parent = new Catalog_Category()
		{
			Id = cat_id++,
			Name = parentName,
			Slug = Slug(parentName),
			IsPublished = 1,
			IsDeleted = 0,
			IncludeInMenu = 1
		};
		var parentEntity = new Core_Entity()
		{
			Id = ent_id++,
			EntityId = parent.Id,
			EntityTypeId = "Category",
			Name = parent.Name,
			Slug = parent.Slug,
		};
		Core_Entities.Add(parentEntity);
		Catalog_Categories.Add(parent);
	}

	category = new Catalog_Category()
	{
		Id=cat_id++,
		Name=name,
		Slug=name.ToLower().Replace(" ","-"),
		IsPublished=1,
		IsDeleted=0,
		IncludeInMenu=1,
		ParentId=parent.Id
	};
	
	var categoryEntity = new Core_Entity()
	{
		Id = ent_id++,
		EntityId=category.Id,
		EntityTypeId="Category",
		Name=category.Name,
		Slug=category.Slug,
	};
	
	Core_Entities.Add(categoryEntity);
	Catalog_Categories.Add(category);
	
	SaveChanges();
	return category;
}

string Slug(string str)
{
	return str.ToLower().Trim().Replace(" ", "-");
}
void CreateAllCategoriesFromIndustries()
{
	
	json.Count().Dump("Total products creating for industries for");
	
	IEnumerable<string> categories = new List<string>();
	
	IEnumerable<string> byIndustry = json.SelectMany(j => j["Industry"].ToString().Split(","))
		.Select(j => j.Trim())
		.Distinct()
		.OrderBy(j => j)
		.Where(j => !string.IsNullOrEmpty(j)).Dump("unique industries")
		.Where(j => !Catalog_Categories.Any(cc => cc.Name == j))
		.Dump("unique non-existing industries");
	categories = categories.Concat(byIndustry);
	CreatedNestedCategories("Индустрии", byIndustry);

	IEnumerable<string> byBrandCategory = json.SelectMany(j => j["Brand"].ToString().Split(","))
		.Select(j => j.Trim())
		.Distinct()
		.OrderBy(j => j)
		.Where(j => !string.IsNullOrEmpty(j)).Dump("unique byBrandCategory")
		.Where(j => !Catalog_Categories.Any(cc => cc.Name == j))
		.Dump("unique non-existing byBrandCategory");
	categories = categories.Concat(byBrandCategory);
	CreatedNestedCategories("Марки", byBrandCategory);

	IEnumerable<string> byProductLine = json.SelectMany(j => j["Line"].ToString().Split(","))
		.Select(j => j.Trim())
		.Distinct()
		.OrderBy(j => j)
		.Where(j => !string.IsNullOrEmpty(j)).Dump("unique byProductLine")
		.Where(j => !Catalog_Categories.Any(cc => cc.Name == j))
		.Dump("unique non-existing byProductLine");

	var lineBrandDict = json
		.DistinctBy(x => x["Line"])
		.ToDictionary(x=>x["Line"],x=>x["Brand"])
		.Dump("lineBrandDict");
	foreach (var lineBrandPair in lineBrandDict)
	{
		var cat = new Catalog_Category() {
			Id=Catalog_Categories.Any() ? Catalog_Categories.Max(x=>x.Id)+1 : 1,
			Name=lineBrandPair.Value.ToString() + " " + lineBrandPair.Key.ToString(),
			Slug=(lineBrandPair.Value.ToString() + " " + lineBrandPair.Key.ToString()).ToLower().Replace(" ","-"),
			IsPublished=1,
			IsDeleted=0,
			Parent=Catalog_Categories.First(x => x.Name == lineBrandPair.Value.ToString())
		};
		var ent = new Core_Entity()
		{
			Id=Core_Entities.Any() ? Core_Entities.Max(x=>x.Id)+1 : 1,
			Name=lineBrandPair.Value.ToString() + " " + lineBrandPair.Key.ToString(),
			Slug=cat.Slug,
			EntityTypeId="Category",
			EntityId=cat.Id
		};
		Catalog_Categories.Add(cat);
		Core_Entities.Add(ent);
		SaveChanges();
	}

	IEnumerable<string> byProductType = json.SelectMany(j => j["Product type"].ToString().Split(","))
		.Select(j => j.Trim())
		.Distinct()
		.OrderBy(j => j)
		.Where(j => !string.IsNullOrEmpty(j)).Dump("unique byProductType")
		.Where(j => !Catalog_Categories.Any(cc => cc.Name == j))
		.Dump("unique non-existing byBrandCategory");
	categories = categories.Concat(byProductType);
	CreatedNestedCategories("Видове обувки", byProductType);

	IEnumerable<string> byNorm = json.SelectMany(j => j["Norm"].ToString().Split(","))
		.Select(j => j.Trim())
		.Distinct()
		.OrderBy(j => j)
		.Where(j => !string.IsNullOrEmpty(j)).Dump("unique byNorm")
		.Where(j => !Catalog_Categories.Any(cc => cc.Name == j))
		.Dump("unique non-existing byNorm");
	IEnumerable<string> byCert = json.SelectMany(j => j["Certificate"].ToString().Split(","))
		.Select(j => j.Trim())
		.Distinct()
		.OrderBy(j => j)
		.Where(j => !string.IsNullOrEmpty(j)).Dump("unique byCert")
		.Where(j => !Catalog_Categories.Any(cc => cc.Name == j))
		.Dump("unique non-existing byCert");
	IEnumerable<string> byNormAndCert = byNorm.Concat(byCert).Distinct();
	categories = categories.Concat(byNormAndCert);
	CreatedNestedCategories("По нормативи и сертификати", byNormAndCert);


	// TODO: create brands, besides categories from brand names
	
	void CreatedNestedCategories(string parentName, IEnumerable<string> childrenNames)
	{
		long cat_id = Catalog_Categories.Any() ? Catalog_Categories.Max(x=>x.Id)+1 : 1;
		long ent_id = Core_Entities.Any() ? Core_Entities.Max(x=>x.Id)+1 : 1;
		
		var parentCategory = Catalog_Categories.FirstOrDefault(cc => cc.Name == parentName) ?? new Catalog_Category()
		{
			Id = cat_id++,
			Name = parentName,
			Slug = parentName.ToLower().Replace(" ", "-"),
			IsPublished = 1,
			IsDeleted = 0,
			Children = new List<Catalog_Category>()
		};
		Catalog_Categories.Add(parentCategory);
		
		var parentCoreEntity = new Core_Entity()
		{
			Id = ent_id++,
			Name = parentCategory.Name,
			Slug = parentCategory.Slug,
			EntityId = parentCategory.Id,
			EntityTypeId = "Category"
		};
		Core_Entities.Add(parentCoreEntity);

		foreach (var categoryName in childrenNames)
		{
			if (Catalog_Categories.Any(cc => cc.Name == categoryName)) continue;
			var category = new Catalog_Category() {
				Id=cat_id++,
				Name=categoryName,
				Slug=categoryName.ToLower().Replace(" ", "-"),
				IsPublished=1,
				IsDeleted=0,
				Parent = parentCategory
			};
			var core_entity = new Core_Entity() {
				Id=ent_id++,
				Name=category.Name,
				Slug=category.Slug,
				EntityId=category.Id,
				EntityTypeId="Category"
			};
			parentCategory.Children.Add(category);
			Catalog_Categories.Add(category);
			Core_Entities.Add(core_entity);
		}
		
		SaveChanges();
	} // CreatedNestedCategories 

} // CreateAllCategoriesFromIndustries

void CreateProduct()
{
	var product_id = Catalog_Products.Any() ? Catalog_Products.Max(cp => cp.Id) + 1 : 1;
	var product = new Catalog_Product()
	{
		Id = product_id,
		Name = $"prod {product_id}",
		Slug = $"prod-{product_id}",
		IsPublished = 1,
		IsFeatured = 1,
		IsVisibleIndividually = 1,
		IsAllowToOrder = 1,
		CreatedOn = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd hh:mm:ss"),
		LatestUpdatedOn = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd hh:mm:ss"),
		//CreatedOn=DateTime.Now.ToFileTime().ToString(),
		//LatestUpdatedOn=DateTime.Now.ToFileTime().ToString(),
		Price = "42.00",
		CreatedBy = Core_Users.First(),
		LatestUpdatedBy = Core_Users.First(),
		//Brand = getBrand("My Brand"),
		TaxClass = getTaxClass("Standard"),
		//ThumbnailImage = Core_Medias.FirstOrDefault() ?? new Core_Media() {Id=1,FileName="filenamegoeshere"}

	};
	Catalog_Products.Add(product);
	Core_Entities.Add(new Core_Entity()
	{
		Id = Core_Entities.Any() ? Core_Entities.Max(ce => ce.Id) + 1 : 1,
		EntityId = product.Id,
		Name = product.Name,
		Slug = product.Slug,
		EntityTypeId = "Product"
	});

	SaveChanges();
	Catalog_Products.First(x => x.Id == product.Id).Dump();
}



Catalog_Brand CreateOrGetBrand(string brandName) 
{
	var brand = Catalog_Brands.FirstOrDefault(cb => cb.Name.ToUpper() == brandName.ToUpper());
	if (brand != null) return brand;
	
	brand = new Catalog_Brand() {
		Id=Catalog_Brands.Any() ? Catalog_Brands.Max(x=>x.Id) + 1 : 1,
		Slug=brandName.ToLower().Replace(" ","-"),
		IsPublished=1,
		IsDeleted=0,
		Name=brandName
	};
	
	Catalog_Brands.Add(brand);
	SaveChanges();
	
	return brand;
}

Tax_TaxClass getTaxClass(string taxClassName)
{
	var taxClass = Tax_TaxClasses.FirstOrDefault(cb => cb.Name.ToUpper() == taxClassName.ToUpper());
	if (taxClass != null) return taxClass;
	
	taxClass = new Tax_TaxClass() {
		Id=Tax_TaxClasses.Any() ? Tax_TaxClasses.Max(x=>x.Id) + 1 : 1,
		Name=taxClassName,
	};
	return taxClass;
}
// You can define other methods, fields, classes and namespaces here

// Universal Product read

List<Product> ReadProducts (JArray json, XElement xml, JArray jsonWPrices)
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
			$"XML product #id:{e.Element("id").Value} has no JSON/XLSX record".Dump();
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
			$"[Index]#{index} has a price, but no existing product".Dump();
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

class ProductVariant
{
	public string Barcode { get; set; }
	public string Currency { get; set; }
	public Double Price { get; set; }
	public string ProductIndex { get; set; }
	public string Size { get; set; }
}
// /Universal Product read