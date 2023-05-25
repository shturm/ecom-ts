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
static string imageDir = @"E:\SRC\simpl2\src\SimplCommerce.WebHost\wwwroot\user-content\";
//static Dictionary<Type,long> pks = new Dictionary<System.Type, long>();

void Main()
{
	//DownloadFile("https://cdn.shopify.com/s/files/1/0555/9694/1509/products/cf503c1b12f5482e82d55a068c739523_3898a9e3-f61b-409c-b0b4-e84d1a6854b6.jpg?v=1650609538").Dump();
	//CreateAllCategoriesFromIndustries();
	CreateAllProducts();
	
	//xml.Elements().First()
	//	.Element("images").Elements()
	//	.Select(x => x.Attribute("url").Value)
	//	.Dump();
}



void CreateAllProducts()
{
	long p_id = Catalog_Products.Any() ? Catalog_Products.Max(x=>x.Id) + 1: 1;
	long e_id = Core_Entities.Any() ? Core_Entities.Max(x=>x.Id) + 1: 1;
	long pc_id = Catalog_ProductCategories.Any() ? Catalog_ProductCategories.Max(x=>x.Id) + 1: 1;
	long pm_id = Catalog_ProductMedias.Any() ? Catalog_ProductMedias.Max(x=>x.Id) + 1: 1;
	long m_id = Core_Medias.Any() ? Core_Medias.Max(x=>x.Id) + 1: 1;
	foreach (var jsonProduct in json)
	{
		if (Catalog_Products.Any(cp => cp.Sku == jsonProduct["Index"].ToString())) continue;
		
		List<Catalog_ProductCategory> productCategories = new();
		List<Catalog_ProductCategory> catByIndustry = jsonProduct["Industry"].ToString().Split(",")
			.Select(s => s.Trim())
			.Distinct()
			.Where(s => !string.IsNullOrEmpty(s))
			.Select(cc => CreateOrGetCategory(cc, "Индустрии"))
			.Select(cc => new Catalog_ProductCategory()
			{
				Id=pc_id++,
				Category = cc,
				IsFeaturedProduct=1,
			}).ToList();
			
		string productStandard = GetProductStandard(jsonProduct["Internal name"].ToString());
		if (!String.IsNullOrEmpty(productStandard))
		{
			productCategories.Add(new Catalog_ProductCategory() {
				Id=pc_id++,
				Category = CreateOrGetCategory(productStandard, "Стандарти"),
				IsFeaturedProduct=1
			});
		}

		productCategories.AddRange(catByIndustry);
		productCategories.Add(new Catalog_ProductCategory() {
			Id=pc_id++,
			Category=Catalog_Categories.FirstOrDefault(cc => cc.Name == "Стандарти"),
			IsFeaturedProduct=1
		});
		productCategories.Add(new Catalog_ProductCategory()
		{
			Id = pc_id++,
			Category = Catalog_Categories.FirstOrDefault(cc => cc.Name == "Индустрии"),
			IsFeaturedProduct = 1
		});


		List<Catalog_ProductMedia> images = xml.Elements().FirstOrDefault(x => x.Element("index").Value == jsonProduct["Index"].ToString())?
			.Element("images").Elements()
			.Select(x => x.Attribute("url").Value)
			.Select(x => DownloadFile(x).Result)
			.Select(x => new Catalog_ProductMedia()
			{
				Id=pm_id++,
				Media= new Core_Media()
				{
					Id=m_id++,
					FileName=x,
					MediaType=1,
				}
			}).ToList();
		
		string priceStringBGN = "1.00";
		try
		{	        
			XElement xmlProduct = xml.Elements().FirstOrDefault(x => x.Element("index").Value == jsonProduct["Index"].ToString());
			string priceStringEUR = xmlProduct.Element("variants").Elements().FirstOrDefault().Attribute("net_price").Value;
			priceStringBGN = (double.Parse(priceStringEUR, CultureInfo.InvariantCulture)*1.95d).ToString();
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
			Sku=jsonProduct["Index"].ToString(),
			IsPublished = 1,
			IsFeatured = 1,
			IsVisibleIndividually = 1,
			IsAllowToOrder = 1,
			CreatedOn="1304750238764851200", //DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(),
			LatestUpdatedOn="1304750238764851200", //DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(),
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
			ProductCatalog_ProductMedias=images
		};
		Catalog_Products.Add(product);
		var entity = new Core_Entity()
		{
			Id = Core_Entities.Any() ? Core_Entities.Max(x=>x.Id) + 1: 1,
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
	List<string> standards = new (){"SI", "SIP", "S2", "S3", "F2A" };
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

