// India States, Cities, and their pincodes
export const INDIA_STATES = {
  'Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Rajahmundry','Tirupati','Kakinada','Anantapur'],
  'Arunachal Pradesh': ['Itanagar','Naharlagun','Tawang','Ziro','Pasighat'],
  'Assam': ['Guwahati','Dibrugarh','Silchar','Jorhat','Nagaon','Tinsukia','Dimapur'],
  'Bihar': ['Patna','Gaya','Bhagalpur','Muzaffarpur','Darbhanga','Arrah','Begusarai','Katihar'],
  'Chhattisgarh': ['Raipur','Bhilai','Bilaspur','Korba','Durg','Rajnandgaon'],
  'Goa': ['Panaji','Margao','Vasco da Gama','Mapusa','Ponda'],
  'Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh','Gandhinagar','Anand','Morbi','Navsari','Mehsana'],
  'Haryana': ['Faridabad','Gurgaon','Hisar','Rohtak','Panipat','Karnal','Ambala','Yamunanagar','Sonipat'],
  'Himachal Pradesh': ['Shimla','Manali','Dharamsala','Solan','Mandi','Kullu'],
  'Jharkhand': ['Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Hazaribagh'],
  'Karnataka': ['Bangalore','Mysore','Hubli','Mangalore','Belgaum','Gulbarga','Davangere','Bellary','Tumkur','Bijapur','Udupi'],
  'Kerala': ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha','Palakkad'],
  'Madhya Pradesh': ['Bhopal','Indore','Jabalpur','Gwalior','Ujjain','Sagar','Dewas','Satna','Ratlam'],
  'Maharashtra': ['Mumbai','Pune','Nagpur','Nashik','Aurangabad','Solapur','Amravati','Nanded','Kolhapur','Thane','Navi Mumbai'],
  'Manipur': ['Imphal','Thoubal','Bishnupur'],
  'Meghalaya': ['Shillong','Tura','Jowai'],
  'Mizoram': ['Aizawl','Lunglei','Saiha'],
  'Nagaland': ['Kohima','Dimapur','Mokokchung'],
  'Odisha': ['Bhubaneswar','Cuttack','Berhampur','Rourkela','Sambalpur','Puri','Brahmapur'],
  'Punjab': ['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Hoshiarpur'],
  'Rajasthan': ['Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner','Alwar','Sikar','Bharatpur'],
  'Sikkim': ['Gangtok','Namchi','Gyalshing'],
  'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Erode','Vellore','Tiruppur','Dindigul'],
  'Telangana': ['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Ramagundam','Secunderabad'],
  'Tripura': ['Agartala','Dharmanagar','Udaipur'],
  'Uttar Pradesh': ['Lucknow','Kanpur','Ghaziabad','Agra','Meerut','Varanasi','Allahabad','Bareilly','Aligarh','Moradabad','Noida','Firozabad'],
  'Uttarakhand': ['Dehradun','Haridwar','Roorkee','Haldwani','Rudrapur','Kashipur'],
  'West Bengal': ['Kolkata','Howrah','Durgapur','Asansol','Siliguri','Bardhaman','Malda','Baharampur'],
  'Andaman and Nicobar Islands': ['Port Blair'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli': ['Silvassa'],
  'Daman and Diu': ['Daman','Diu'],
  'Delhi': ['New Delhi','Delhi','Dwarka','Rohini','Pitampura','Janakpuri','Saket','Laxmi Nagar'],
  'Jammu and Kashmir': ['Srinagar','Jammu','Anantnag','Baramulla','Sopore'],
  'Ladakh': ['Leh','Kargil'],
  'Lakshadweep': ['Kavaratti'],
  'Puducherry': ['Puducherry','Karaikal','Yanam'],
};

// City-to-pincode mapping (first/main pincode for each city)
export const CITY_PINCODE = {
  // Andhra Pradesh
  Visakhapatnam: '530001', Vijayawada: '520001', Guntur: '522001', Nellore: '524001',
  Kurnool: '518001', Rajahmundry: '533101', Tirupati: '517501', Kakinada: '533001', Anantapur: '515001',
  // Arunachal Pradesh
  Itanagar: '791111', Naharlagun: '791110', Tawang: '790104', Ziro: '791120', Pasighat: '791102',
  // Assam
  Guwahati: '781001', Dibrugarh: '786001', Silchar: '788001', Jorhat: '785001',
  Nagaon: '782001', Tinsukia: '786125', Dimapur: '797112',
  // Bihar
  Patna: '800001', Gaya: '823001', Bhagalpur: '812001', Muzaffarpur: '842001',
  Darbhanga: '846001', Arrah: '802301', Begusarai: '851101', Katihar: '854105',
  // Chhattisgarh
  Raipur: '492001', Bhilai: '490001', Bilaspur: '495001', Korba: '495677',
  Durg: '491001', Rajnandgaon: '491441',
  // Goa
  Panaji: '403001', Margao: '403601', 'Vasco da Gama': '403802', Mapusa: '403507', Ponda: '403401',
  // Gujarat
  Ahmedabad: '380001', Surat: '395001', Vadodara: '390001', Rajkot: '360001',
  Bhavnagar: '364001', Jamnagar: '361001', Junagadh: '362001', Gandhinagar: '382010',
  Anand: '388001', Morbi: '363641', Navsari: '396445', Mehsana: '384001',
  // Haryana
  Faridabad: '121001', Gurgaon: '122001', Hisar: '125001', Rohtak: '124001',
  Panipat: '132103', Karnal: '132001', Ambala: '134003', Yamunanagar: '135001', Sonipat: '131001',
  // Himachal Pradesh
  Shimla: '171001', Manali: '175131', Dharamsala: '176215', Solan: '173212', Mandi: '175001', Kullu: '175101',
  // Jharkhand
  Ranchi: '834001', Jamshedpur: '831001', Dhanbad: '826001', Bokaro: '827001',
  Deoghar: '814112', Hazaribagh: '825301',
  // Karnataka
  Bangalore: '560001', Mysore: '570001', Hubli: '580020', Mangalore: '575001',
  Belgaum: '590001', Gulbarga: '585101', Davangere: '577001', Bellary: '583101',
  Tumkur: '572101', Bijapur: '586101', Udupi: '576101',
  // Kerala
  Thiruvananthapuram: '695001', Kochi: '682001', Kozhikode: '673001', Thrissur: '680001',
  Kollam: '691001', Kannur: '670001', Alappuzha: '688001', Palakkad: '678001',
  // Madhya Pradesh
  Bhopal: '462001', Indore: '452001', Jabalpur: '482001', Gwalior: '474001',
  Ujjain: '456001', Sagar: '470001', Dewas: '455001', Satna: '485001', Ratlam: '457001',
  // Maharashtra
  Mumbai: '400001', Pune: '411001', Nagpur: '440001', Nashik: '422001',
  Aurangabad: '431001', Solapur: '413001', Amravati: '444601', Nanded: '431601',
  Kolhapur: '416001', Thane: '400601', 'Navi Mumbai': '400703',
  // Manipur
  Imphal: '795001', Thoubal: '795138', Bishnupur: '795126',
  // Meghalaya
  Shillong: '793001', Tura: '794001', Jowai: '793150',
  // Mizoram
  Aizawl: '796001', Lunglei: '796701', Saiha: '796901',
  // Nagaland
  Kohima: '797001', Mokokchung: '798601',
  // Odisha
  Bhubaneswar: '751001', Cuttack: '753001', Berhampur: '760001', Rourkela: '769001',
  Sambalpur: '768001', Puri: '752001', Brahmapur: '760001',
  // Punjab
  Ludhiana: '141001', Amritsar: '143001', Jalandhar: '144001', Patiala: '147001',
  Bathinda: '151001', Mohali: '160055', Hoshiarpur: '146001',
  // Rajasthan
  Jaipur: '302001', Jodhpur: '342001', Udaipur: '313001', Kota: '324001',
  Ajmer: '305001', Bikaner: '334001', Alwar: '301001', Sikar: '332001', Bharatpur: '321001',
  // Sikkim
  Gangtok: '737101', Namchi: '737126', Gyalshing: '737111',
  // Tamil Nadu
  Chennai: '600001', Coimbatore: '641001', Madurai: '625001', Tiruchirappalli: '620001',
  Salem: '636001', Tirunelveli: '627001', Erode: '638001', Vellore: '632001',
  Tiruppur: '641601', Dindigul: '624001',
  // Telangana
  Hyderabad: '500001', Warangal: '506001', Nizamabad: '503001', Karimnagar: '505001',
  Khammam: '507001', Ramagundam: '505209', Secunderabad: '500003',
  // Tripura
  Agartala: '799001', Dharmanagar: '799251', Udaipur: '799120',
  // Uttar Pradesh
  Lucknow: '226001', Kanpur: '208001', Ghaziabad: '201001', Agra: '282001',
  Meerut: '250001', Varanasi: '221001', Allahabad: '211001', Bareilly: '243001',
  Aligarh: '202001', Moradabad: '244001', Noida: '201301', Firozabad: '283203',
  // Uttarakhand
  Dehradun: '248001', Haridwar: '249401', Roorkee: '247667', Haldwani: '263139',
  Rudrapur: '263153', Kashipur: '244713',
  // West Bengal
  Kolkata: '700001', Howrah: '711101', Durgapur: '713201', Asansol: '713301',
  Siliguri: '734001', Bardhaman: '713101', Malda: '732101', Baharampur: '742101',
  // UTs
  'Port Blair': '744101', Chandigarh: '160001', Silvassa: '396230',
  Daman: '396210', Diu: '362520',
  'New Delhi': '110001', Delhi: '110001', Dwarka: '110075', Rohini: '110085',
  Pitampura: '110088', Janakpuri: '110058', Saket: '110017', 'Laxmi Nagar': '110092',
  Srinagar: '190001', Jammu: '180001', Anantnag: '192101', Baramulla: '193101', Sopore: '193201',
  Leh: '194101', Kargil: '194103', Kavaratti: '682555',
  Puducherry: '605001', Karaikal: '609601', Yanam: '533464',
};

export const STATE_LIST = Object.keys(INDIA_STATES).sort();
export const getCities  = (state) => INDIA_STATES[state] || [];
export const getCityPincode = (city) => CITY_PINCODE[city] || '';
