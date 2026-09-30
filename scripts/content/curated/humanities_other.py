"""Curated syllabi for education, social sciences, arts & humanities,
agriculture & veterinary, and media & communication.

Sources: HEC revised curricula for B.Ed (Hons) Elementary, BS Psychology, BS Urdu,
BSc (Hons) Agriculture, and BS Mass Communication / Media Studies.
"""

from __future__ import annotations

HEC_BED = ("HEC revised curriculum — B.Ed (Hons) Elementary / ADE", "https://www.hec.gov.pk/", "2026-09-30")
HEC_PSY = ("HEC revised curriculum — BS Psychology", "https://www.hec.gov.pk/", "2026-09-30")
HEC_URDU = ("HEC revised curriculum — BS Urdu", "https://www.hec.gov.pk/", "2026-09-30")
HEC_AGRI = ("HEC revised curriculum — BSc (Hons) Agriculture (Agronomy)", "https://www.hec.gov.pk/", "2026-09-30")
HEC_MEDIA = ("HEC revised curriculum — BS Mass Communication / Media Studies", "https://www.hec.gov.pk/", "2026-09-30")

COURSES = [
    {
        "id": "teaching_methods",
        "field": "education",
        "category": "b_ed_teaching",
        "title": "B.Ed — General Methods of Teaching",
        "title_ur": "طریقۂ تدریس",
        "description": (
            "Planning, delivering and assessing a lesson: the professional core of teacher "
            "education, grounded in how people actually learn."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "HEC — B.Ed (Hons) Elementary professional core",
        "source": HEC_BED,
        "outcomes": [
            "Write measurable learning objectives at appropriate cognitive levels.",
            "Plan a lesson with aligned objectives, activities and assessment.",
            "Select teaching methods suited to content, learners and resources.",
            "Use formative assessment to adjust instruction.",
        ],
        "concepts": [
            ("learning_theories", "Theories of learning", "Behaviourist, cognitive, constructivist and social learning views, and what each implies for a classroom.", "understand", 2, 60, [], "essay", ["behaviourism", "constructivism", "Vygotsky"]),
            ("objectives", "Writing learning objectives", "Bloom's taxonomy, observable verbs, and the difference between an aim and an objective.", "apply", 2, 50, ["learning_theories"], "practical", ["Bloom", "SMART", "observable"]),
            ("lesson_planning", "Lesson planning", "Constructive alignment of objective, activity and assessment; timing and contingency.", "apply", 3, 65, ["objectives"], "practical", ["alignment", "lesson plan", "sequencing"]),
            ("teaching_methods", "Teaching methods and strategies", "Lecture, demonstration, inquiry, discussion, cooperative learning, and how to choose.", "analyze", 3, 65, ["lesson_planning"], "case_study", ["inquiry", "cooperative learning", "demonstration"]),
            ("questioning", "Questioning techniques", "Open vs closed questions, wait time, and distributing questions across a class.", "apply", 3, 45, ["teaching_methods"], "practical", ["wait time", "probing", "open question"]),
            ("classroom_management", "Classroom management", "Rules and routines, preventive management, and responding to disruption without escalation.", "apply", 3, 55, ["teaching_methods"], "case_study", ["routine", "discipline", "engagement"]),
            ("differentiation", "Differentiated instruction", "Adapting content, process and product for mixed-ability and multi-grade classes.", "analyze", 4, 55, ["classroom_management"], "case_study", ["differentiation", "multi-grade", "scaffolding"]),
            ("teaching_aids", "Instructional materials and AV aids", "Choosing and making low-cost teaching aids; the cognitive load argument for restraint.", "apply", 2, 45, ["teaching_methods"], "practical", ["AV aid", "low-cost", "cognitive load"]),
            ("formative_assessment", "Formative assessment", "Checking for understanding during a lesson and acting on what you find.", "apply", 3, 50, ["objectives"], "practical", ["exit ticket", "feedback", "checking understanding"]),
            ("summative_assessment", "Summative assessment and test construction", "Item writing, table of specifications, validity and reliability.", "analyze", 4, 60, ["formative_assessment"], "practical", ["table of specifications", "validity", "reliability"]),
            ("feedback", "Effective feedback", "Task-level feedback that tells a learner what to do next, not just what was wrong.", "apply", 3, 40, ["formative_assessment"], "case_study", ["feedback", "feed-forward"]),
            ("micro_teaching", "Micro-teaching and reflective practice", "Practising a single skill, receiving critique, and structured reflection on teaching.", "evaluate", 3, 55, ["lesson_planning", "questioning"], "practical", ["micro-teaching", "reflection", "peer critique"]),
        ],
    },
    {
        "id": "intro_psychology",
        "field": "social_sciences",
        "category": "psychology",
        "title": "Introduction to Psychology",
        "title_ur": "نفسیات کا تعارف",
        "description": (
            "The scientific study of behaviour and mental processes: perspectives, methods, "
            "and the core findings of each major subfield."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "HEC — BS Psychology core",
        "source": HEC_PSY,
        "outcomes": [
            "Compare the major theoretical perspectives in psychology.",
            "Evaluate the design of a psychological study.",
            "Explain memory, learning and motivation using established models.",
            "Distinguish normal variation from clinically significant behaviour.",
        ],
        "concepts": [
            ("what_is_psychology", "Psychology as a science", "Goals of psychology, and what separates it from folk explanation of behaviour.", "understand", 1, 45, [], "mcq", ["description", "prediction", "explanation"]),
            ("perspectives", "Theoretical perspectives", "Biological, behavioural, cognitive, psychodynamic, humanistic and sociocultural views.", "understand", 2, 55, ["what_is_psychology"], "essay", ["psychodynamic", "cognitive", "humanistic"]),
            ("research_methods", "Research methods", "Experiment, correlation, case study and survey; operational definitions and control.", "analyze", 3, 65, ["what_is_psychology"], "case_study", ["variable", "control group", "correlation"]),
            ("ethics_research", "Research ethics", "Informed consent, deception, debriefing and the harm principle.", "evaluate", 3, 40, ["research_methods"], "essay", ["consent", "debriefing", "IRB"]),
            ("biological_basis", "Biological basis of behaviour", "Neurons, neurotransmitters, brain structures and the nervous system divisions.", "understand", 3, 60, ["perspectives"], "mcq", ["neuron", "synapse", "cortex"]),
            ("sensation_perception", "Sensation and perception", "Transduction, thresholds, Gestalt organisation and perceptual constancy.", "understand", 3, 55, ["biological_basis"], "mcq", ["threshold", "Gestalt", "constancy"]),
            ("learning", "Learning", "Classical and operant conditioning, reinforcement schedules and observational learning.", "apply", 3, 60, ["perspectives"], "case_study", ["conditioning", "reinforcement", "modelling"]),
            ("memory", "Memory", "Encoding, storage and retrieval; working memory, long-term memory and forgetting.", "analyze", 3, 60, ["learning"], "short_answer", ["working memory", "encoding", "retrieval"]),
            ("cognition", "Thinking, language and intelligence", "Problem solving, heuristics and bias, language acquisition, and measuring intelligence.", "analyze", 4, 60, ["memory"], "essay", ["heuristic", "bias", "IQ"]),
            ("motivation_emotion", "Motivation and emotion", "Drive, incentive and humanistic accounts; theories of emotion.", "understand", 3, 50, ["learning"], "short_answer", ["intrinsic", "Maslow", "James-Lange"]),
            ("development", "Developmental psychology", "Piaget's stages, attachment, and development across the lifespan.", "understand", 3, 55, ["learning"], "essay", ["Piaget", "attachment", "lifespan"]),
            ("personality", "Personality", "Trait, psychodynamic and humanistic theories; the Big Five and personality assessment.", "analyze", 4, 50, ["perspectives"], "case_study", ["Big Five", "trait", "assessment"]),
            ("social_psychology", "Social psychology", "Attitudes, conformity, obedience, group influence and attribution.", "analyze", 4, 55, ["perspectives"], "case_study", ["conformity", "attribution", "obedience"]),
            ("abnormal", "Psychological disorders", "Defining abnormality, major diagnostic categories, and the stigma problem.", "evaluate", 4, 55, ["personality"], "case_study", ["DSM", "abnormality", "stigma"]),
        ],
    },
    {
        "id": "urdu_literature",
        "field": "arts_humanities",
        "category": "urdu_literature",
        "title": "Urdu Literature — Poetry and Prose",
        "title_ur": "اردو ادب: شعر و نثر",
        "description": (
            "The development of Urdu literature from the classical ghazal to modern fiction, "
            "with the critical vocabulary needed to analyse a text."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "HEC — BS Urdu core",
        "source": HEC_URDU,
        "outcomes": [
            "Trace the historical development of Urdu poetic and prose forms.",
            "Analyse a ghazal using conventional critical terminology.",
            "Compare the work of major poets and prose writers in context.",
            "Write a critical appreciation of an Urdu text.",
        ],
        "concepts": [
            ("origins", "Origins and development of Urdu", "Urdu's emergence, the Dakhni period, and the shift of the literary centre to Delhi and Lucknow.", "understand", 2, 55, [], "essay", ["Dakhni", "Delhi", "Lucknow"]),
            ("poetic_forms", "Poetic forms", "Ghazal, nazm, qasida, marsiya, masnavi and rubai — form, occasion and convention.", "understand", 2, 60, ["origins"], "short_answer", ["ghazal", "nazm", "marsiya"]),
            ("arooz", "Prosody and metre", "Arooz, bahr, taqti and the practical business of scanning a line.", "apply", 4, 65, ["poetic_forms"], "practical", ["bahr", "taqti", "arooz"]),
            ("poetic_devices", "Imagery and rhetorical devices", "Tashbih, istiara, kinaya, and the conventional symbol set of the ghazal.", "analyze", 3, 55, ["poetic_forms"], "short_answer", ["tashbih", "istiara", "symbol"]),
            ("classical_poets", "Classical poets", "Mir, Sauda, Dard and Ghalib: sensibility, diction and their characteristic concerns.", "analyze", 4, 70, ["poetic_devices"], "essay", ["Mir", "Ghalib", "classical"]),
            ("iqbal", "Iqbal", "Khudi, the reconstruction of self and community, and Iqbal's break with ghazal convention.", "analyze", 4, 60, ["classical_poets"], "essay", ["Iqbal", "khudi", "philosophy"]),
            ("modern_poetry", "Modern and progressive poetry", "Faiz, Josh, Rashid and Miraji; the Progressive Writers' Movement and free verse.", "analyze", 4, 60, ["iqbal"], "essay", ["Faiz", "progressive", "azad nazm"]),
            ("prose_beginnings", "Beginnings of Urdu prose", "Fort William College, Ghalib's letters, and Sir Syed's reformist prose.", "understand", 3, 50, ["origins"], "essay", ["Fort William", "Sir Syed", "letters"]),
            ("novel", "The Urdu novel", "From Nazir Ahmad and Umrao Jan Ada to Aag ka Darya: the novel's changing social function.", "analyze", 4, 65, ["prose_beginnings"], "essay", ["novel", "Nazir Ahmad", "Qurratulain Hyder"]),
            ("afsana", "The short story (afsana)", "Premchand, Manto, Bedi and Chughtai; realism, censorship and the Partition story.", "analyze", 4, 60, ["novel"], "essay", ["Manto", "afsana", "Partition"]),
            ("drama_essay", "Drama and the essay", "Urdu drama from Amanat to radio and television; the inshaiya and humorous essay.", "understand", 3, 45, ["prose_beginnings"], "short_answer", ["drama", "inshaiya", "Mushtaq Ahmed Yousufi"]),
            ("criticism", "Urdu literary criticism", "Hali's Muqaddama, Shibli, and the movement from didactic to formal criticism.", "evaluate", 5, 60, ["classical_poets", "novel"], "essay", ["Hali", "Muqaddama", "tanqeed"]),
            ("critical_appreciation", "Writing a critical appreciation", "Close reading, situating a text in its period, and supporting a claim with the text itself.", "evaluate", 4, 55, ["criticism", "poetic_devices"], "essay", ["close reading", "appreciation", "argument"]),
        ],
    },
    {
        "id": "agronomy_principles",
        "field": "agriculture_vet",
        "category": "agronomy_crop_science",
        "title": "Principles of Agronomy",
        "title_ur": "اصولِ زراعت",
        "description": (
            "Crop production as a managed system: soil, water, nutrients, seed and protection, "
            "applied to the Pakistani cropping calendar."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 2, 1),
        "accreditation": "HEC — BSc (Hons) Agriculture core",
        "source": HEC_AGRI,
        "outcomes": [
            "Relate soil physical and chemical properties to crop performance.",
            "Plan a crop rotation for a given agro-ecological zone.",
            "Calculate fertiliser and irrigation requirements for a field.",
            "Select integrated management practices for common pests and weeds.",
        ],
        "concepts": [
            ("agronomy_scope", "Scope of agronomy", "Agronomy's place among the agricultural sciences and Pakistan's agro-ecological zones.", "understand", 1, 40, [], "mcq", ["agro-ecological zone", "cropping system"]),
            ("soil_physical", "Soil physical properties", "Texture, structure, bulk density, porosity and their effect on root growth.", "understand", 2, 55, ["agronomy_scope"], "practical", ["texture", "structure", "bulk density"]),
            ("soil_chemical", "Soil chemistry and fertility", "pH, salinity, cation exchange capacity, organic matter and nutrient availability.", "analyze", 3, 60, ["soil_physical"], "numerical", ["pH", "CEC", "salinity"]),
            ("soil_water", "Soil-water relationships", "Field capacity, permanent wilting point, available water and infiltration.", "analyze", 3, 55, ["soil_physical"], "numerical", ["field capacity", "wilting point", "infiltration"]),
            ("tillage", "Tillage and seedbed preparation", "Conventional, minimum and zero tillage; the trade-off with soil structure.", "apply", 2, 45, ["soil_physical"], "case_study", ["tillage", "zero tillage", "seedbed"]),
            ("seed_sowing", "Seed quality and sowing", "Germination percentage, seed rate calculation, sowing depth, time and geometry.", "apply", 3, 55, ["tillage"], "numerical", ["seed rate", "germination", "row spacing"]),
            ("crop_growth", "Crop growth and development", "Growth stages, growth analysis, photoperiod and thermal time.", "analyze", 4, 55, ["seed_sowing"], "numerical", ["growth stage", "GDD", "photoperiod"]),
            ("nutrient_management", "Nutrient management", "Essential nutrients, deficiency symptoms, fertiliser recommendation and application timing.", "apply", 3, 65, ["soil_chemical", "crop_growth"], "numerical", ["NPK", "deficiency", "split application"]),
            ("irrigation", "Irrigation management", "Crop water requirement, scheduling, and surface versus pressurised methods.", "apply", 4, 60, ["soil_water", "crop_growth"], "numerical", ["ETc", "scheduling", "drip"]),
            ("weed_management", "Weed management", "Weed classification, competition losses, and cultural, mechanical and chemical control.", "apply", 3, 55, ["crop_growth"], "case_study", ["weed", "herbicide", "competition"]),
            ("pest_disease", "Integrated pest and disease management", "Economic threshold, scouting, biological control and pesticide stewardship.", "analyze", 4, 55, ["weed_management"], "case_study", ["IPM", "economic threshold", "scouting"]),
            ("kharif_rabi", "Kharif and rabi crop production", "Wheat, rice, cotton, maize and sugarcane: package of practices by season.", "apply", 4, 70, ["nutrient_management", "irrigation"], "case_study", ["wheat", "rice", "cotton", "kharif", "rabi"]),
            ("rotation_harvest", "Cropping systems, harvest and storage", "Rotation and intercropping rationale, harvest indices, and post-harvest losses.", "evaluate", 4, 50, ["kharif_rabi"], "case_study", ["rotation", "intercropping", "post-harvest"]),
        ],
    },
    {
        "id": "journalism_reporting",
        "field": "media_communication",
        "category": "journalism",
        "title": "Journalism — News Reporting & Writing",
        "title_ur": "صحافت: خبر نویسی",
        "description": (
            "Finding, verifying and writing news: news values, structure, interviewing, "
            "beat reporting, ethics and media law as practised in Pakistan."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 2, 1),
        "accreditation": "HEC — BS Mass Communication / Media Studies core",
        "source": HEC_MEDIA,
        "outcomes": [
            "Judge the newsworthiness of an event using news values.",
            "Write a clean inverted-pyramid news story to deadline.",
            "Conduct and use an interview, attributing sources correctly.",
            "Apply professional ethics and relevant media law to a reporting decision.",
        ],
        "concepts": [
            ("news_values", "News values and news judgement", "Timeliness, proximity, impact, prominence, conflict and human interest — and their misuse.", "analyze", 2, 50, [], "case_study", ["news value", "proximity", "impact"]),
            ("news_structure", "News story structure", "The inverted pyramid, why it exists, and where alternative structures work better.", "apply", 2, 55, ["news_values"], "practical", ["inverted pyramid", "nut graf"]),
            ("lead_writing", "Writing the lead", "Summary leads, the five Ws and H, and cutting a lead to its load-bearing words.", "apply", 3, 55, ["news_structure"], "practical", ["lead", "5W1H", "intro"]),
            ("body_writing", "Body, quotes and attribution", "Ordering by descending importance, direct vs indirect quotes, and attribution discipline.", "apply", 3, 55, ["lead_writing"], "practical", ["attribution", "quote", "paraphrase"]),
            ("sources", "Sources and verification", "Primary vs secondary sources, on/off the record, corroboration, and resisting a single source.", "evaluate", 4, 60, ["body_writing"], "case_study", ["verification", "off the record", "corroboration"]),
            ("interviewing", "Interviewing", "Preparation, question sequencing, listening past the prepared answer, and note discipline.", "apply", 3, 55, ["sources"], "practical", ["interview", "follow-up", "notes"]),
            ("beat_reporting", "Beat reporting", "Building a beat, cultivating contacts, and covering courts, crime, health and local government.", "apply", 4, 55, ["interviewing"], "case_study", ["beat", "contacts", "court reporting"]),
            ("feature_writing", "Feature and human-interest writing", "Narrative structure, scene setting, and the difference from a news story.", "apply", 3, 55, ["body_writing"], "practical", ["feature", "narrative", "anecdotal lead"]),
            ("editing", "Editing, headlines and style", "Copy editing for accuracy and concision, headline writing, and the house style sheet.", "analyze", 3, 50, ["body_writing"], "practical", ["copy editing", "headline", "style guide"]),
            ("ethics_journalism", "Journalism ethics", "Accuracy, fairness, privacy, conflict of interest, and handling of sensitive subjects.", "evaluate", 4, 55, ["sources"], "essay", ["ethics", "fairness", "privacy"]),
            ("media_law", "Media law in Pakistan", "Defamation, contempt, the right to information and broadcast regulation.", "understand", 4, 55, ["ethics_journalism"], "case_study", ["defamation", "contempt", "RTI"]),
            ("digital_reporting", "Digital and mobile reporting", "Filing for the web, social verification, SEO headlines, and the correction culture.", "apply", 3, 50, ["editing"], "practical", ["digital", "verification", "correction"]),
            ("data_journalism", "Introduction to data journalism", "Finding a dataset, basic analysis, and not over-claiming from a small sample.", "analyze", 4, 50, ["digital_reporting"], "practical", ["dataset", "analysis", "visualisation"]),
        ],
    },
]
