from geopy.geocoders import Nominatim
import json

# Crear instancia del geocodificador
geolocator = Nominatim(user_agent="my_app")

# Lista de códigos CCA3 de los países
cca3_codes = [
    "CHN", "IND", "USA", "IDN", "PAK", "NGA", "BRA", "BGD", "RUS", "MEX",
    "JPN", "ETH", "PHL", "EGY", "COD", "VNM", "IRN", "TUR", "DEU", "THA",
    "GBR", "TZA", "FRA", "ZAF", "ITA", "MMR", "KEN", "COL", "KOR", "ESP",
    "UGA", "SDN", "ARG", "DZA", "IRQ", "AFG", "POL", "UKR", "CAN", "MAR",
    "SAU", "AGO", "UZB", "PER", "MYS", "YEM", "GHA", "MOZ", "NPL", "MDG",
    "VEN", "CIV", "CMR", "NER", "AUS", "PRK", "TWN", "BFA", "MLI", "SYR",
    "LKA", "MWI", "ZMB", "ROU", "CHL", "KAZ", "ECU", "GTM", "TCD", "SOM",
    "NLD", "SEN", "KHM", "ZWE", "GIN", "RWA", "BEN", "BDI", "TUN", "BOL",
    "BEL", "HTI", "JOR", "DOM", "CUB", "SSD", "SWE", "CZE", "HND", "GRC",
    "AZE", "PRT", "PNG", "HUN", "TJK", "BLR", "ARE", "ISR", "AUT", "TGO",
    "CHE", "SLE", "LAO", "HKG", "SRB", "NIC", "LBY", "BGR", "PRY", "KGZ",
    "TKM", "SLV", "SGP", "COG", "DNK", "SVK", "CAF", "FIN", "LBN", "NOR",
    "LBR", "PSE", "NZL", "CRI", "IRL", "MRT", "OMN", "PAN", "KWT", "HRV",
    "GEO", "ERI", "URY", "MNG", "MDA", "PRI", "BIH", "ALB", "JAM", "ARM",
    "LTU", "GMB", "QAT", "BWA", "NAM", "GAB", "LSO", "SVN", "GNB", "MKD",
    "LVA", "GNQ", "TTO", "BHR", "TLS", "EST", "MUS", "CYP", "SWZ", "DJI",
    "REU", "FJI", "COM", "GUY", "BTN", "SLB", "MAC", "LUX", "MNE", "SUR",
    "CPV", "ESH", "MLT", "MDV", "BRN", "BHS", "BLZ", "GLP", "ISL", "MTQ",
    "VUT", "MYT", "PYF", "GUF", "NCL", "BRB", "STP", "WSM", "CUW", "LCA",
    "GUM", "KIR", "GRD", "FSM", "JEY", "SYC", "TON", "ABW", "VCT", "VIR",
    "ATG", "IMN", "AND", "DMA", "CYM", "BMU", "GGY", "GRL", "FRO", "NFK",
    "KNA", "TCA", "ASM", "SXM", "MHL", "LIE", "MCO", "SMR", "GIB", "MAF",
    "VGB", "PLW", "COK", "AIA", "NRU", "WLF", "TUV", "BLM", "SPM", "MSR",
    "FLK", "NIU", "TKL", "VAT"
]


# Diccionario para almacenar los datos
data = {}

# Obtener latitud y longitud para cada código CCA3
for cca3 in cca3_codes:
    location = geolocator.geocode(cca3)
    if location:
        data[cca3] = {
            "latitud": location.latitude,
            "longitud": location.longitude
        }

# Guardar los datos en un archivo JSON
with open("paises.json", "w") as outfile:
    json.dump(data, outfile)
