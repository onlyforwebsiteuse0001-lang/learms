"""The 11 fields and 68 categories of the HAAFIZ course library.

Categories were chosen to match how Pakistani institutions actually advertise programmes
(so a student recognises their own path) rather than an abstract academic ontology.
Field and category names carry Urdu translations; `build_library.py` copies them through.

Shape: (field_id, field_name_en, field_name_ur, description, [(category_id, name_en, name_ur), ...])
"""

from __future__ import annotations

FIELDS: list[tuple[str, str, str, str, list[tuple[str, str, str]]]] = [
    (
        "natural_sciences",
        "Natural Sciences",
        "طبیعی علوم",
        "Physics, chemistry, biology, mathematics and the earth sciences.",
        [
            ("physics", "Physics", "طبیعیات"),
            ("chemistry", "Chemistry", "کیمیا"),
            ("biology", "Biology", "حیاتیات"),
            ("mathematics", "Mathematics", "ریاضی"),
            ("environmental_science", "Environmental Science", "ماحولیاتی سائنس"),
            ("earth_space_science", "Earth & Space Science", "ارضی و فضائی سائنس"),
        ],
    ),
    (
        "it_computing",
        "IT & Computing",
        "آئی ٹی و کمپیوٹنگ",
        "Computing disciplines following the HEC/NCEAC Computing Curricula 2023 structure.",
        [
            ("computer_science", "Computer Science", "کمپیوٹر سائنس"),
            ("software_engineering", "Software Engineering", "سافٹ ویئر انجینئرنگ"),
            ("web_development", "Web Development", "ویب ڈویلپمنٹ"),
            ("data_science_ai", "Data Science & AI", "ڈیٹا سائنس و مصنوعی ذہانت"),
            ("cyber_security", "Cyber Security", "سائبر سیکیورٹی"),
            ("networks_cloud", "Networks & Cloud", "نیٹ ورکس و کلاؤڈ"),
            ("mobile_development", "Mobile Development", "موبائل ڈویلپمنٹ"),
            ("database_systems", "Database Systems", "ڈیٹابیس سسٹمز"),
        ],
    ),
    (
        "health_medicine",
        "Health & Medicine",
        "صحت و طب",
        "PMDC/PNC/PPC-regulated clinical and allied health programmes.",
        [
            ("mbbs_medicine", "MBBS & Medicine", "ایم بی بی ایس و طب"),
            ("nursing", "Nursing", "نرسنگ"),
            ("pharmacy", "Pharmacy", "فارمیسی"),
            ("dentistry", "Dentistry", "دندان سازی"),
            ("allied_health", "Allied Health Sciences", "الائیڈ ہیلتھ سائنسز"),
            ("public_health", "Public Health", "پبلک ہیلتھ"),
            ("physiotherapy", "Physiotherapy", "فزیوتھراپی"),
        ],
    ),
    (
        "business_accounting",
        "Business & Accounting",
        "کاروبار و اکاؤنٹنگ",
        "Professional accountancy bodies (ACCA, ICMAP, ICAP) and university business programmes.",
        [
            ("accounting_acca", "ACCA", "اے سی سی اے"),
            ("management_accounting_cma", "CMA / ICMAP", "سی ایم اے"),
            ("chartered_accountancy_ca", "CA / ICAP", "سی اے"),
            ("business_administration", "Business Administration", "بزنس ایڈمنسٹریشن"),
            ("finance_banking", "Finance & Banking", "فنانس و بینکنگ"),
            ("marketing", "Marketing", "مارکیٹنگ"),
            ("economics_business", "Business Economics", "کاروباری معاشیات"),
        ],
    ),
    (
        "engineering",
        "Engineering",
        "انجینئرنگ",
        "PEC-accredited engineering disciplines.",
        [
            ("civil", "Civil Engineering", "سول انجینئرنگ"),
            ("mechanical", "Mechanical Engineering", "مکینیکل انجینئرنگ"),
            ("electrical", "Electrical Engineering", "الیکٹریکل انجینئرنگ"),
            ("electronics_telecom", "Electronics & Telecom", "الیکٹرانکس و ٹیلی کام"),
            ("chemical", "Chemical Engineering", "کیمیکل انجینئرنگ"),
            ("software_engineering_pec", "Software Engineering (PEC)", "سافٹ ویئر انجینئرنگ"),
            ("mechatronics", "Mechatronics", "میکاٹرانکس"),
        ],
    ),
    (
        "law",
        "Law",
        "قانون",
        "Five-year LLB under HEC and Pakistan Bar Council rules.",
        [
            ("llb_foundation", "LLB Foundation", "ایل ایل بی بنیادی"),
            ("constitutional_law", "Constitutional Law", "آئینی قانون"),
            ("criminal_law", "Criminal Law", "فوجداری قانون"),
            ("corporate_commercial_law", "Corporate & Commercial Law", "کارپوریٹ و تجارتی قانون"),
            ("international_law", "International Law", "بین الاقوامی قانون"),
        ],
    ),
    (
        "education",
        "Education",
        "تعلیم",
        "Teacher education and educational sciences.",
        [
            ("b_ed_teaching", "B.Ed & Teaching Methods", "بی ایڈ و طریقۂ تدریس"),
            ("educational_psychology", "Educational Psychology", "تعلیمی نفسیات"),
            ("curriculum_assessment", "Curriculum & Assessment", "نصاب و جانچ"),
            ("special_education", "Special Education", "خصوصی تعلیم"),
            ("educational_leadership", "Educational Leadership", "تعلیمی قیادت"),
        ],
    ),
    (
        "social_sciences",
        "Social Sciences",
        "سماجی علوم",
        "Human behaviour, society, politics and development.",
        [
            ("psychology", "Psychology", "نفسیات"),
            ("sociology", "Sociology", "عمرانیات"),
            ("political_science", "Political Science", "سیاسیات"),
            ("international_relations", "International Relations", "بین الاقوامی تعلقات"),
            ("anthropology", "Anthropology", "بشریات"),
            ("development_studies", "Development Studies", "ترقیاتی مطالعات"),
        ],
    ),
    (
        "arts_humanities",
        "Arts & Humanities",
        "فنون و علومِ انسانی",
        "Literature, history, philosophy, religious studies and the fine arts.",
        [
            ("english_literature", "English Literature", "انگریزی ادب"),
            ("urdu_literature", "Urdu Literature", "اردو ادب"),
            ("history", "History", "تاریخ"),
            ("philosophy", "Philosophy", "فلسفہ"),
            ("islamic_studies", "Islamic Studies", "اسلامیات"),
            ("fine_arts", "Fine Arts", "فنونِ لطیفہ"),
        ],
    ),
    (
        "agriculture_vet",
        "Agriculture & Veterinary",
        "زراعت و حیوانیات",
        "Crop science, livestock, veterinary medicine and food systems.",
        [
            ("agronomy_crop_science", "Agronomy & Crop Science", "زراعت و فصلیات"),
            ("animal_husbandry", "Animal Husbandry", "حیوانی پرورش"),
            ("veterinary_medicine", "Veterinary Medicine", "ویٹرنری طب"),
            ("food_science", "Food Science & Technology", "غذائی سائنس"),
            ("agricultural_economics", "Agricultural Economics", "زرعی معاشیات"),
        ],
    ),
    (
        "media_communication",
        "Media & Communication",
        "ابلاغ و ذرائع ابلاغ",
        "Journalism, mass communication and digital media production.",
        [
            ("journalism", "Journalism", "صحافت"),
            ("mass_communication", "Mass Communication", "ابلاغِ عامہ"),
            ("digital_media", "Digital Media", "ڈیجیٹل میڈیا"),
            ("film_television", "Film & Television", "فلم و ٹیلی ویژن"),
            ("public_relations", "Public Relations", "تعلقاتِ عامہ"),
            ("advertising", "Advertising", "اشتہارات"),
        ],
    ),
]
