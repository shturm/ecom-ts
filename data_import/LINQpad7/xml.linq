<Query Kind="Statements" />

var xml_string =File.ReadAllText(@"C:\Users\alex\Desktop\file.xml");
var xEl = XElement.Parse(xml_string);
xEl.Dump();
//xEl.Descendants("Attachment").Dump("Attachment descendants");
//xEl.Descendants("AdditionalProviderFilter").Dump("AdditionalProviderFilter  descendants");
//xEl.Descendants().Dump("any descendants");
xEl.Descendants().Where(e => e.Name.LocalName=="Attachment").Dump("Attachment local name descendants")
.Select(e => e.Value).Dump();
foreach (var x in xEl.Descendants().Where(e => e.Name.LocalName=="Attachment")) {
	x.Value = "";
	x.Dump("truncated attachment");
}
xEl.Dump("after truncation");
xEl.ToString().Dump("stringed");