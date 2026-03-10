import uuid
from datetime import datetime, timezone

def _id():
    return str(uuid.uuid4())

def _now():
    return datetime.now(timezone.utc).isoformat()

IMG_BASE = "https://customer-assets.emergentagent.com/job_phytocode-farm/artifacts"

PRODUCTS = [
    # ===== BIOSTIMULANTS =====
    {
        "id": _id(), "name": "Trumagic", "slug": "trumagic", "category": "biostimulant",
        "image_url": "",
        "tagline": {"en": "Anti-Stress and Growth Activator", "te": "యాంటీ-స్ట్రెస్ మరియు గ్రోత్ యాక్టివేటర్", "kn": "ಆಂಟಿ-ಸ್ಟ್ರೆಸ್ ಮತ್ತು ಗ್ರೋತ್ ಆಕ್ಟಿವೇಟರ್", "hi": "एंटी-स्ट्रेस और ग्रोथ एक्टिवेटर"},
        "overview": {
            "en": "Trumagic is a premium, fully water-soluble biostimulant formulation designed to supercharge plant resilience and vigor. It delivers rapid relief from abiotic stresses like drought, salinity, heat, cold, and nutrient shortages while unlocking explosive growth potential.",
            "te": "Trumagic ప్రీమియం, పూర్తిగా నీటిలో కరిగే బయోస్టిమ్యులెంట్. డ్రాయిల్, ఉప్పు, వేడి, చలి వంటి స్ట్రెస్‌ల నుండి వేగంగా ఉపశమనం అందిస్తుంది.",
            "kn": "Trumagic ಒಂದು ಪ್ರೀಮಿಯಂ, ಸಂಪೂರ್ಣ ನೀರಿನಲ್ಲಿ ಕರಗುವ ಬಯೋಸ್ಟಿಮ್ಯುಲೆಂಟ್. ಡ್ರೌಟ್, ಉಪ್ಪು, ಗ್ರೀಷ್ಮ ಸ್ಟ್ರೆಸ್‌ಗಳಿಂದ ತ್ವರಿತ ಉಪಶಮನ ನೀಡುತ್ತದೆ.",
            "hi": "ट्रूमैजिक एक प्रीमियम, पूर्ण जल में घुलनशील बायोस्टिमुलेंट। सूखा, खारापन, गर्मी जैसे तनावों से त्वरित राहत देता है।"
        },
        "composition": [
            {"component": "Alginic acid (% by weight, min)", "specification": "0.102"},
            {"component": "Glycine (% by weight, min)", "specification": "10"},
            {"component": "Humic acid (% by weight, min)", "specification": "9.89"},
            {"component": "Fulvic acid (% by weight, min)", "specification": "0.31"},
            {"component": "Vitamin C (% by weight, min)", "specification": "2.0"},
            {"component": "Total dissolved solids (%)", "specification": "10.22"},
            {"component": "Total organic carbon (% by weight, min)", "specification": "4.5"},
            {"component": "pH (1% aqueous solution)", "specification": "8.70 +/- 0.2"},
            {"component": "Specific gravity", "specification": "1.0097 +/- 0.03"},
            {"component": "Solubility (%, min)", "specification": "99.77"}
        ],
        "how_it_works": {
            "en": ["Stress Mitigation: Glycine (10%) stabilizes proteins and cell membranes under drought, heat, or salinity.", "Nutrient Optimization: Humic (9.89%) and fulvic acids chelate micronutrients, enhancing uptake by 20-30%.", "Cell Fortification: Alginic acid strengthens cell walls; Vitamin C scavenges reactive oxygen species.", "Metabolic Ignition: Organic carbon fuels hormone synthesis for expanded root systems and larger fruits."],
            "te": ["స్ట్రెస్ మిటిగేషన్: గ్లైసిన్ ప్రోటీన్లు, సెల్ మెంబ్రేన్‌లను స్థిరీకరిస్తుంది.", "న్యూట్రియెంట్ ఆప్టిమైజేషన్: హ్యూమిక్-ఫ్యూల్విక్ ఆసిడ్‌లు మైక్రోన్యూట్రియెంట్లను చెలేట్ చేస్తాయి.", "సెల్ ఫార్టిఫికేషన్: ఆల్జినిక్ ఆసిడ్ సెల్ వాల్స్‌ను బలపరుస్తుంది.", "మెటాబాలిక్ ఇగ్నిషన్: ఆర్గానిక్ కార్బన్ హార్మోన్ సింథెసిస్‌ను ఇంధనపోస్తుంది."],
            "kn": ["ಸ್ಟ್ರೆಸ್ ಮಿಟಿಗೇಶನ್: ಗ್ಲೈಸಿನ್ ಪ್ರೋಟೀನ್‌ಗಳನ್ನು ಸ್ಥಿರಗೊಳಿಸುತ್ತದೆ.", "ನ್ಯೂಟ್ರಿಯಂಟ್ ಆಪ್ಟಿಮೈಸೇಶನ್: ಹ್ಯೂಮಿಕ್-ಫುಲ್ವಿಕ್ ಆಸಿಡ್‌ಗಳು ಮೈಕ್ರೋನ್ಯೂಟ್ರಿಯಂಟ್‌ಗಳನ್ನು ಚೆಲೇಟ್ ಮಾಡುತ್ತವೆ.", "ಸೆಲ್ ಫಾರ್ಟಿಫಿಕೇಶನ್: ಅಲ್ಜಿನಿಕ್ ಆಸಿಡ್ ಸೆಲ್ ವಾಲ್‌ಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.", "ಮೆಟಾಬಾಲಿಕ್ ಇಗ್ನಿಷನ್: ಆರ್ಗಾನಿಕ್ ಕಾರ್ಬನ್ ಹಾರ್ಮೋನ್ ಸಿಂಥೆಸಿಸ್ ಅನ್ನು ಇಂಧನಿಸುತ್ತದೆ."],
            "hi": ["तनाव हरण: ग्लाइसीन प्रोटीन और कोशिका झिल्ली को स्थिर करता है।", "पोषक अनुकूलन: ह्यूमिक-फुल्विक एसिड सूक्ष्म पोषक तत्वों को चेलेट करते हैं।", "कोशिका सुदृढ़ीकरण: एल्जिनिक एसिड कोशिका भित्तियों को मजबूत करता है।", "चयापचय उत्तेजना: ऑर्गेनिक कार्बन हार्मोन संश्लेषण को ईंधन देता है।"]
        },
        "growth_stages": {
            "en": ["Vegetative: Robust root expansion and shoot growth", "Reproductive: Boosts flower retention and pollen viability", "Fruit Filling: Enhances sugar accumulation and water efficiency", "Stress Recovery: Restores metabolism post-adversity"],
            "te": ["వెజిటేటివ్: రూట్ ఎక్స్‌పాన్షన్", "రిప్రోడక్టివ్: ఫ్లవర్ రిటెన్షన్", "ఫ్రూట్ ఫిల్లింగ్: షుగర్ అక్యుములేషన్", "స్ట్రెస్ రికవరీ: పోస్ట్-అడ్వర్సిటీ"],
            "kn": ["ವೆಜಿಟೇಟಿವ್: ರೂಟ್ ವಿಸ್ತರಣೆ", "ರಿಪ್ರೋಡಕ್ಟಿವ್: ಹೂವು ರಿಟೆನ್ಷನ್", "ಫ್ರೂಟ್ ಫಿಲಿಂಗ್: ಷುಗರ್ ಸಂಗ್ರಹ", "ಸ್ಟ್ರೆಸ್ ರಿಕವರಿ: ಪೋಸ್ಟ್-ಅಡ್ವರ್ಸಿಟಿ"],
            "hi": ["शाकीय: जड़ विस्तार", "प्रजनन: फूल स्थिरता", "फल भराई: शर्करा संचय", "तनाव पुनर्प्राप्ति: विपरीत परिस्थिति के बाद"]
        },
        "dosage": {"en": "Foliar: 2-4 ml/L | Fertigation: 2-3 L/acre", "te": "ఫోలియార్: 2-4 ml/L | ఫెర్టిగేషన్: 2-3 L/ఎకరం", "kn": "ಫೋಲಿಯಾರ್: 2-4 ml/L | ಫರ್ಟಿಗೇಶನ್: 2-3 L/ಎಕರೆ", "hi": "फोलियर: 2-4 ml/L | फर्टिगेशन: 2-3 L/एकड़"},
        "advantages": {
            "en": ["100% soluble, zero residue - compatible with IPM programs", "Quick-action formula: Systemic uptake in hours, results in 48-72 hours", "Up to 30% stress tolerance boost in trials", "15-25% yield gains with enhanced fruit quality"],
            "te": ["100% సాల్యుబుల్, జీరో రెసిడ్యూ", "క్విక్-యాక్షన్: 48-72 గంటల్లో ఫలితాలు", "30% స్ట్రెస్ టాలరెన్స్ బూస్ట్", "15-25% యీల్డ్ పెరుగుదల"],
            "kn": ["100% ಸಾಲ್ಯುಬಲ್, ಜೀರೋ ರೆಸಿಡ್ಯೂ", "ತ್ವರಿತ ಕ್ರಿಯೆ: 48-72 ಗಂಟೆಗಳಲ್ಲಿ ಫಲಿತಾಂಶ", "30% ಸ್ಟ್ರೆಸ್ ಟಾಲರೆನ್ಸ್ ಬೂಸ್ಟ್", "15-25% ಇಳುವೈ ಗಳಿಕೆ"],
            "hi": ["100% घुलनशील, शून्य अवशेष", "त्वरित क्रिया: 48-72 घंटों में परिणाम", "30% तनाव सहनशीलता वृद्धि", "15-25% उपज वृद्धि"]
        },
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    {
        "id": _id(), "name": "Helia", "slug": "helia", "category": "biostimulant",
        "image_url": f"{IMG_BASE}/cul6f41q_helia.png",
        "tagline": {"en": "Flowering and Fruiting Stimulator", "te": "ఫ్లవరింగ్ అండ్ ఫ్రూటింగ్ స్టిమ్యులేటర్", "kn": "ಫ್ಲವರಿಂಗ್ ಮತ್ತು ಫ್ರೂಟಿಂಗ್ ಸ್ಟಿಮ್ಯುಲೇಟರ್", "hi": "फ्लावरिंग और फ्रूटिंग स्टिमुलेटर"},
        "overview": {
            "en": "Helia ignites prolific flowering and bountiful fruiting by supercharging reproductive physiology. Blends amino acids, humic-fulvic complexes, seaweed alginates, and vitamin C to trigger bud break, pollen viability, and ovary development.",
            "te": "హెలియా ప్రొలిఫిక్ ఫ్లవరింగ్, బౌంటిఫుల్ ఫ్రూటింగ్‌ను ఇగ్నైట్ చేస్తుంది.",
            "kn": "ಹೆಲಿಯಾ ಪ್ರಚುರ ಫ್ಲವರಿಂಗ್ ಮತ್ತು ಫ್ರೂಟಿಂಗ್ ಅನ್ನು ಇಗ್ನೈಟ್ ಮಾಡುತ್ತದೆ.",
            "hi": "हेलिया फूलने और फलने को प्रज्वलित करती है।"
        },
        "composition": [
            {"component": "Alginic acid (% by weight, min)", "specification": "0.102"},
            {"component": "Glycine (% by weight, min)", "specification": "10"},
            {"component": "Humic acid (% by weight, min)", "specification": "9.89"},
            {"component": "Fulvic acid (% by weight, min)", "specification": "0.31"},
            {"component": "Vitamin C (% by weight, min)", "specification": "2.0"},
            {"component": "Total dissolved solids (%)", "specification": "10.22"},
            {"component": "Total organic carbon (% by weight, min)", "specification": "4.5"},
            {"component": "pH (1% aqueous solution)", "specification": "8.70 +/- 0.2"},
            {"component": "Specific gravity", "specification": "1.0097 +/- 0.03"},
            {"component": "Solubility (%, min)", "specification": "99.77"}
        ],
        "how_it_works": {
            "en": ["Bloom Ignition: Glycine fuels cytokinin/gibberellin synthesis, boosting flower initiation by 20-30%.", "Pollen & Set Power: Humic-fulvic acids chelate boron/calcium for pollen tube growth.", "Stress-Proof Reproduction: Alginic acid and vitamin C fortify ovaries, reducing drop by 25%.", "Fruit Fill Turbo: Organic carbon ramps metabolism for larger, uniform fruits."],
            "te": ["బ్లూమ్ ఇగ్నిషన్: గ్లైసిన్ సైటోకినిన్ సింథెసిస్.", "పోలెన్ సెట్: హ్యూమిక్-ఫ్యూల్విక్ ఫెర్టిలైజేషన్.", "స్ట్రెస్-ప్రూఫ్: డ్రాప్ 25% తగ్గిస్తాయి.", "ఫ్రూట్ ఫిల్: కార్బన్ సింక్ స్ట్రెంగ్త్."],
            "kn": ["ಬ್ಲೂಮ್ ಇಗ್ನಿಷನ್: ಗ್ಲೈಸಿನ್ ಸೈಟೋಕಿನಿನ್ ಸಿಂಥೆಸಿಸ್.", "ಪಾಲೆನ್ ಸೆಟ್: ಹ್ಯೂಮಿಕ್-ಫುಲ್ವಿಕ್ ಫೆರ್ಟಿಲೈಜೇಶನ್.", "ಸ್ಟ್ರೆಸ್-ಪ್ರೂಫ್: ಡ್ರಾಪ್ 25% ಕಡಿಮೆ.", "ಫ್ರೂಟ್ ಫಿಲ್: ಕಾರ್ಬನ್ ಸಿಂಕ್ ಸ್ಟ್ರೆಂಗ್ತ್."],
            "hi": ["फूल प्रज्वलन: ग्लाइसीन साइटोकाइनिन बढ़ाता है।", "पराग/सेट: ह्यूमिक-फुल्विक उर्वरता बढ़ाते हैं।", "तनाव-प्रूफ: ड्रॉप 25% कम।", "फल भराई: कार्बन चयापचय तेज करता है।"]
        },
        "growth_stages": {"en": ["Bud Break: Induces uniform flowering", "Anthesis: Enhances pollen fertility and set", "Fruit Set: Prevents abscission, promotes retention", "Early Fruit Development: Swells berries/pods for yield"], "te": ["బడ్ బ్రేక్: యూనిఫాం ఫ్లవరింగ్", "ఆంథెసిస్: పోలెన్ వయాబిలిటీ", "ఫ్రూట్ సెట్: రిటెన్షన్", "ఎర్లీ ఫ్రూట్: స్వెల్స్"], "kn": ["ಬಡ್ ಬ್ರೇಕ್: ಏಕರೂಪ ಫ್ಲವರಿಂಗ್", "ಆಂತೆಸಿಸ್: ಪಾಲೆನ್ ವೈಯಾಬಿಲಿಟಿ", "ಫ್ರೂಟ್ ಸೆಟ್: ರಿಟೆನ್ಷನ್", "ಆರಂಭಿಕ ಫ್ರೂಟ್: ಸ್ವೆಲ್"], "hi": ["कलिका: एकसमान फूल", "फ्लावरिंग: पराग शक्ति", "फ्रूट सेट: रिटेंशन", "प्रारंभिक विकास: वृद्धि"]},
        "dosage": {"en": "Foliar: 1-2 ml/L | Drip: 200-500 ml/ha", "te": "1-2 ml/L ఫోలియార్", "kn": "1-2 ml/L ಫೋಲಿಯಾರ್", "hi": "1-2 ml/L फोलियर"},
        "advantages": {"en": ["Triggers abundant blooms and sets", "Stress-resilient reproduction", "99.77% soluble, rapid uptake", "15-25% more flowers and fruit sets"], "te": ["అబండెంట్ బ్లూమ్స్/సెట్స్", "99.77% సాల్యుబుల్"], "kn": ["ಅಪಾರ ಬ್ಲೂಮ್‌ಗಳು/ಸೆಟ್‌ಗಳು", "99.77% ಘುಲನಶೀಲ"], "hi": ["प्रचुर फूल/फल", "99.77% घुलनशील"]},
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    {
        "id": _id(), "name": "Hauser", "slug": "hauser", "category": "biostimulant",
        "image_url": f"{IMG_BASE}/y3s9ornz_hauser.png",
        "tagline": {"en": "Fruit Sweller and Shine Enhancer", "te": "ఫ్రూట్ స్వెల్లర్ అండ్ షైన్ ఎన్‌హాన్సర్", "kn": "ಫ್ರೂಟ್ ಸ್ವೆಲ್ಲರ್ ಮತ್ತು ಶೈನ್ ಎನ್ಹಾನ್ಸರ್", "hi": "फ्रूट स्वेलर और शाइन एन्हांसर"},
        "overview": {"en": "Hauser turbocharges fruit development, swelling size for heavier, market-dominating produce with irresistible glossy shine. Amino-powered biostimulant drives explosive fibrous roots for unmatched water/nutrient uptake.", "te": "హాఉజర్ ఫ్రూట్ డెవలప్‌మెంట్‌ను టర్బోచార్జ్ చేస్తుంది, సైజ్ స్వెల్ చేసి గ్లాసీ షైన్ ఇస్తుంది.", "kn": "ಹೌಸರ್ ಫ್ರೂಟ್ ಅಭಿವೃದ್ಧಿಯನ್ನು ಟರ್ಬೊಚಾರ್ಜ್ ಮಾಡುತ್ತದೆ.", "hi": "हॉजर फ्रूट विकास को टर्बोचार्ज करता है।"},
        "composition": [
            {"component": "Free amino acids (% w/v, min)", "specification": "0.69"},
            {"component": "Alginic acid (% w/v, min)", "specification": "0.02"},
            {"component": "Humic acid (% w/v, min)", "specification": "4.10"},
            {"component": "Total organic carbon (% by wt, min)", "specification": "2.0"},
            {"component": "Total dissolved solids (% w/v, min)", "specification": "7.5"},
            {"component": "Specific gravity", "specification": "0.95 - 1.05"},
            {"component": "pH (1% aqueous solution)", "specification": "7.0 - 9.0"},
            {"component": "Solubility (%, min)", "specification": ">99"}
        ],
        "how_it_works": {"en": ["Root Powerhouse: Free amino acids spike root elongation, expanding absorptive surface by 25-40%.", "Soil Optimization: Humic acid improves aggregation and unlocks bound nutrients.", "Cell Swell Mechanism: Alginic acid regulates turgor pressure for 15-25% size gains.", "Shine & Quality Boost: Seaweed extracts deposit natural waxes for gloss and enhanced sugars."], "te": ["రూట్ పవర్‌హౌస్: అమినోలు రూట్ సర్ఫేస్ 25-40% పెంచుతాయి.", "సాయిల్ ఆప్టిమైజేషన్: హ్యూమిక్ న్యూట్రియెంట్స్ అన్‌లాక్.", "సెల్ స్వెల్: 15-25% సైజ్ గెయిన్స్.", "షైన్ బూస్ట్: సీవీడ్ వాక్సెస్."], "kn": ["ರೂಟ್ ಪವರ್‌ಹೌಸ್: 25-40% ಸರ್ಫೇಸ್ ವಿಸ್ತರಣೆ.", "ಮಣ್ಣು ಆಪ್ಟಿಮೈಸೇಶನ್: ಪೋಷಕಗಳನ್ನು ಮುಕ್ತಗೊಳಿಸುತ್ತದೆ.", "ಸೆಲ್ ಸ್ವೆಲ್: 15-25% ಆಕಾರ ಹೆಚ್ಚಳ.", "ಚಮಕು ಬೂಸ್ಟ್: ಸೀವೀಡ್ ವ್ಯಾಕ್ಸ್."], "hi": ["जड़ पावर: 25-40% सतह विस्तार.", "मिट्टी अनुकूलन: पोषक अनलॉक.", "कोशिका स्वेल: 15-25% आकार वृद्धि.", "चमक बूस्ट: समुद्री शैवाल वैक्स."]},
        "growth_stages": {"en": ["Fruit Set: Initiates uniform sizing", "Cell Division: Maximizes early fruitlet expansion", "Cell Enlargement: Swells volume for plump maturity", "Pre-Harvest: Polishes shine and firmness"], "te": ["ఫ్రూట్ సెట్: యూనిఫాం సైజింగ్", "సెల్ డివిజన్: ఎక్స్‌పాన్షన్", "సెల్ ఎన్‌లార్జ్‌మెంట్: ప్లంప్ మెచ్యూరిటీ", "ప్రీ-హార్వెస్ట్: షైన్"], "kn": ["ಫ್ರೂಟ್ ಸೆಟ್: ಏಕರೂಪ ಆಕಾರ", "ಸೆಲ್ ಡಿವಿಜನ್: ವಿಸ್ತರಣೆ", "ಸೆಲ್ ವಿಸ್ತರಣೆ: ಪ್ಲಮ್ಪ್ ಮೆಚ್ಯೂರಿಟಿ", "ಪೂರ್ವ-ಕೊಯ್ಲು: ಚಮಕು"], "hi": ["फ्रूट सेट: एकसमान आकार", "कोशिका विभाजन: विस्तार", "कोशिका वृद्धि: प्लंपनेस", "पूर्व-कटाई: चमक"]},
        "dosage": {"en": "Foliar: 2-4 ml/L | Drip: 500-1500 ml/ha", "te": "2-4 ml/L ఫోలియార్", "kn": "2-4 ml/L ಫೋಲಿಯಾರ್", "hi": "2-4 ml/L फोलियर"},
        "advantages": {"en": ["Bigger fruits with professional-level shine", "Root-to-fruit nutrient pipeline", "99% soluble, no clogging", "20%+ fruit weight increase in trials"], "te": ["బిగ్గర్ ఫ్రూట్స్, ప్రో షైన్", "99% సాల్యుబుల్"], "kn": ["ದೊಡ್ಡ ಫಲಗಳು, ಪ್ರೊ ಚಮಕು", "99% ಘುಲನಶೀಲ"], "hi": ["बड़ा फल, प्रो चमक", "99% घुलनशील"]},
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    {
        "id": _id(), "name": "Grip", "slug": "grip", "category": "biostimulant",
        "image_url": f"{IMG_BASE}/o3ml464y_grip.png",
        "tagline": {"en": "Root Turbocharger and Nutrient Booster", "te": "రూట్ టర్బోచార్జర్ అండ్ న్యూట్రియెంట్ బూస్టర్", "kn": "ರೂಟ್ ಟರ್ಬೊಚಾರ್ಜರ್ ಮತ್ತು ನ್ಯೂಟ್ರಿಯಂಟ್ ಬೂಸ್ಟರ್", "hi": "रूट टर्बोचार्जर और न्यूट्रिएंट बूस्टर"},
        "overview": {"en": "Grip supercharges root architecture and nutrient dynamics for unstoppable crop performance. This amino-driven, fully soluble biostimulant explodes fibrous root mass, enabling massive water and nutrient capture.", "te": "గ్రిప్ రూట్ ఆర్కిటెక్చర్ మరియు న్యూట్రియెంట్ డైనమిక్స్‌ను సూపర్‌చార్జ్ చేస్తుంది.", "kn": "ಗ್ರಿಪ್ ರೂಟ್ ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಪೋಷಕ ಗತಿಶೀಲತೆಯನ್ನು ಸೂಪರ್‌ಚಾರ್ಜ್ ಮಾಡುತ್ತದೆ.", "hi": "ग्रिप रूट संरचना और पोषक गतिशीलता को सुपरचार्ज करता है।"},
        "composition": [
            {"component": "Free amino acids (% w/v, min)", "specification": "0.69"},
            {"component": "Alginic acid (% w/v, min)", "specification": "0.02"},
            {"component": "Humic acid (% w/v, min)", "specification": "4.10"},
            {"component": "Total organic carbon (% by wt, min)", "specification": "2.0"},
            {"component": "Total dissolved solids (% w/v, min)", "specification": "7.5"},
            {"component": "Specific gravity", "specification": "0.95 - 1.05"},
            {"component": "pH (1% aqueous solution)", "specification": "7.0 - 9.0"},
            {"component": "Solubility (%, min)", "specification": ">99"}
        ],
        "how_it_works": {"en": ["Root Explosion: Free amino acids boost lateral root initiation by 30-50%.", "Soil & Uptake Mastery: Humic acid enhances microbial activity for 20-40% better absorption.", "Growth Amplification: Alginic acid strengthens root tips; organic carbon fuels cell division.", "Yield Polish: Organics elevate chlorophyll and sugar translocation for premium appeal."], "te": ["రూట్ ఎక్స్‌ప్లోషన్: ల్యాటరల్ రూట్స్ 30-50% పెరుగుదల.", "సాయిల్ అప్‌టేక్: 20-40% అబ్సార్ప్షన్.", "గ్రోత్: సెల్ డివిజన్ ఇంధనం.", "యీల్డ్ పాలిష్: క్లోరోఫిల్ పెరుగుదల."], "kn": ["ರೂಟ್ ಸ್ಫೋಟನ: 30-50% ರೂಟ್ ಹೆಚ್ಚಳ.", "ಮಣ್ಣು ಅವಶೋಷಣೆ: 20-40% ಸುಧಾರಣೆ.", "ವೃದ್ಧಿ: ಸೆಲ್ ಡಿವಿಜನ್.", "ಇಳುವೈ ಪಾಲಿಷ್: ಕ್ಲೋರೋಫಿಲ್ ಹೆಚ್ಚಳ."], "hi": ["रूट विस्फोट: 30-50% रूट वृद्धि.", "मिट्टी अवशोषण: 20-40% सुधार.", "वृद्धि: कोशिका विभाजन.", "उपज पॉलिश: क्लोरोफिल वृद्धि."]},
        "growth_stages": {"en": ["Seedling: Accelerates root establishment", "Vegetative: Maximizes fibrous roots for nutrient scouting", "Reproductive: Sustains water supply for fruit swelling", "Maturity: Improves skin quality and storage"], "te": ["సీడ్లింగ్: రూట్ స్థాపన", "వెజిటేటివ్: ఫైబ్రస్ రూట్స్", "రిప్రోడక్టివ్: వాటర్ సప్లై", "మెచ్యూరిటీ: స్కిన్ క్వాలిటీ"], "kn": ["ಬೀಜಾಂಗ: ರೂಟ್ ಸ್ಥಾಪನೆ", "ಶಾಕೀಯ: ಫೈಬರಸ್ ರೂಟ್‌ಗಳು", "ಪ್ರಜನನ: ನೀರು ಸರಬರಾಜು", "ಪರಿಪಕ್ವತೆ: ಚರ್ಮ ಗುಣಮಟ್ಟ"], "hi": ["बीजाणु: रूट स्थापना", "शाकीय: फाइब्रस रूट्स", "प्रजनन: जल आपूर्ति", "परिपक्वता: त्वचा गुणवत्ता"]},
        "dosage": {"en": "Foliar: 1-3 ml/L | Soil/Drip: 300-1000 ml/ha", "te": "1-3 ml/L ఫోలియార్", "kn": "1-3 ml/L ಫೋಲಿಯಾರ್", "hi": "1-3 ml/L फोलियर"},
        "advantages": {"en": ["Explosive roots without excess top growth", "99% soluble, tank-mix friendly", "Boosts yields by 20%+ in trials", "15-30% root biomass increase"], "te": ["ఎక్స్‌ప్లోసివ్ రూట్స్", "99% సాల్యుబుల్", "20%+ యీల్డ్"], "kn": ["ಸ್ಫೋಟಕ ಜಡಗಳು", "99% ಘುಲನಶೀಲ", "20%+ ಇಳುವೈ"], "hi": ["विस्फोटक जड़ें", "99% घुलनशील", "20%+ उपज"]},
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    {
        "id": _id(), "name": "Thrive", "slug": "thrive", "category": "biostimulant",
        "image_url": "",
        "tagline": {"en": "Premium Seaweed Flakes Biostimulant", "te": "ప్రీమియం సీవీడ్ ఫ్లేక్స్ బయోస్టిమ్యులెంట్", "kn": "ಪ್ರೀಮಿಯಂ ಸೀವೀಡ್ ಫ್ಲೇಕ್ಸ್ ಬಯೋಸ್ಟಿಮ್ಯುಲೆಂಟ್", "hi": "प्रीमियम सीवीड फ्लेक्स बायोस्टिमुलेंट"},
        "overview": {"en": "Thrive delivers 90% pure Ascophyllum nodosum seaweed flakes - nature's ultimate growth catalyst. Packed with auxins, cytokinins, gibberellins, alginic acid (4% min), and 30% organic carbon.", "te": "త్రైవ్ 90% ప్యూర్ ఆస్కోఫిలమ్ నోడోసమ్ సీవీడ్ ఫ్లేక్స్.", "kn": "ತ್ರೈವ್ 90% ಶುದ್ಧ ಅಸ್ಕೋಫಿಲಮ್ ನೋಡೋಸಮ್ ಸೀವೀಡ್ ಫ್ಲೇಕ್ಸ್.", "hi": "थ्राइव 90% शुद्ध एस्कोफिलम नोडोसम फ्लेक्स।"},
        "composition": [
            {"component": "Ascophyllum nodosum flakes", "specification": "90%"},
            {"component": "Alginic acid (% by weight, min)", "specification": "4"},
            {"component": "Bulk density (g/ml)", "specification": "0.527"},
            {"component": "pH (10% aqueous solution)", "specification": "9.3 +/- 0.2"},
            {"component": "Total organic carbon (% by weight, min)", "specification": "30"},
            {"component": "Solubility (% by weight, min)", "specification": "100"}
        ],
        "how_it_works": {"en": ["Hormone Symphony: Natural PGRs drive cell division/elongation; alginic acid binds water/nutrients.", "Nutrient Supercharge: 30% organic carbon fuels microbes; chelates micros for 25-40% uptake boost.", "Vigor Engine: Skyrockets chlorophyll and enzyme activity for lush, stress-proof growth.", "Yield Architect: Improves fruit set, size, Brix; extends shelf life via antioxidants."], "te": ["హార్మోన్ సింఫనీ: PGRs సెల్ ఎలాంగేషన్.", "న్యూట్రియెంట్ సూపర్‌చార్జ్: 25-40% అప్‌టేక్.", "విగర్ ఇంజిన్: క్లోరోఫిల్ స్కైరాకెట్.", "యీల్డ్ ఆర్కిటెక్ట్: ఫ్రూట్ సెట్, Brix."], "kn": ["ಹಾರ್ಮೋನ್ ಸಿಂಫನಿ: PGRs ಸೆಲ್ ಎಲಾಂಗೇಶನ್.", "ಪೋಷಕ ಸೂಪರ್‌ಚಾರ್ಜ್: 25-40% ಅಪ್‌ಟೇಕ್.", "ವಿಗರ್ ಇಂಜಿನ್: ಕ್ಲೋರೋಫಿಲ್.", "ಇಳುವೈ: ಫ್ರೂಟ್ ಸೆಟ್, Brix."], "hi": ["हार्मोन समन्वय: PGRs विभाजन/विस्तार.", "पोषक सुपरचार्ज: 25-40% अवशोषण.", "जोश इंजन: क्लोरोफिल वृद्धि.", "उपज: सेट/आकार सुधार."]},
        "growth_stages": {"en": ["Seedling: Vigorous establishment", "Vegetative: Dense, balanced canopy", "Reproductive: Enhanced set/fill", "Maturity: Quality polish"], "te": ["సీడ్లింగ్: విగరస్", "వెజిటేటివ్: డెన్స్ కానోపీ", "రిప్రోడక్టివ్: సెట్/ఫిల్", "మెచ్యూరిటీ: క్వాలిటీ"], "kn": ["ಬೀಜಾಂಗ: ವಿಗರಸ್", "ಶಾಕೀಯ: ದಟ್ಟ ಕಾನೋಪಿ", "ಪ್ರಜನನ: ಸೆಟ್/ಫಿಲ್", "ಪರಿಪಕ್ವತೆ: ಗುಣಮಟ್ಟ"], "hi": ["बीजाणु: स्थापना", "शाकीय: छत्र", "प्रजनन: सेट/भराई", "परिपक्वता: गुणवत्ता"]},
        "dosage": {"en": "Foliar: 200g/acre | Tomato: 750 g/ha, three applications", "te": "200g/ఎకరం ఫోలియార్", "kn": "200g/ಎಕರೆ ಫೋಲಿಯಾರ್", "hi": "200g/एकड़ फोलियर"},
        "advantages": {"en": ["90% pure flakes - maximum potency", "100% soluble, zero residue", "Multi-stress protector", "20-30% growth acceleration"], "te": ["90% ప్యూర్ ఫ్లేక్స్", "100% సాల్యుబుల్"], "kn": ["90% ಶುದ್ಧ ಫ್ಲೇಕ್ಸ್", "100% ಘುಲನಶೀಲ"], "hi": ["90% शुद्ध फ्लेक्स", "100% घुलनशील"]},
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    {
        "id": _id(), "name": "Humvee", "slug": "humvee", "category": "biostimulant",
        "image_url": "",
        "tagline": {"en": "Improved and Balanced Growth Promoter", "te": "ఇంప్రూవ్డ్ అండ్ బ్యాలెన్స్డ్ గ్రోత్ ప్రోమోటర్", "kn": "ಸುಧಾರಿತ ಮತ್ತು ಸಮತೋಲಿತ ವೃದ್ಧಿ ಪ್ರೋಮೋಟರ್", "hi": "बेहतर और संतुलित वृद्धि प्रमोटर"},
        "overview": {"en": "Humvee unleashes balanced, vigorous growth by supercharging nutrient dynamics and soil biology. Ultra-concentrated 22% water-soluble humates/fulvates biostimulant.", "te": "హమ్వీ 22% వాటర్-సాల్యుబుల్ హ్యూమేట్స్/ఫుల్వేట్స్ బయోస్టిమ్యులెంట్.", "kn": "ಹಮ್ವೀ 22% ನೀರು-ಘುಲನಶೀಲ ಹ್ಯೂಮೇಟ್ಸ್/ಫುಲ್ವೇಟ್ಸ್.", "hi": "हमवी 22% जल-घुलनशील ह्यूमेट्स/फुल्वेट्स।"},
        "composition": [
            {"component": "Total water-soluble humates and fulvates (% w/v, min)", "specification": "22.0"},
            {"component": "pH (1:5 aqueous solution)", "specification": "9.0"},
            {"component": "Specific gravity", "specification": "1.05"}
        ],
        "how_it_works": {"en": ["Nutrient Unlocking: Humates chelate Fe, Zn, Mn, Ca - boosting uptake by 30-50%.", "Soil Revitalization: Builds aggregates, multiplies beneficial microbes.", "Plant Power Surge: Stimulates root branching 20-40% more mass.", "Stress Mastery: Enhances drought/heat tolerance via osmoprotectants."], "te": ["న్యూట్రియెంట్ అన్‌లాక్: 30-50% అప్‌టేక్.", "సాయిల్ రివైటలైజేషన్: మైక్రోబ్స్.", "ప్లాంట్ పవర్: రూట్ బ్రాంచింగ్ 20-40%.", "స్ట్రెస్ మాస్టరీ: డ్రాయిల్/హీట్."], "kn": ["ಪೋಷಕ ಅನ್‌ಲಾಕ್: 30-50% ಅವಶೋಷಣೆ.", "ಮಣ್ಣು ಪುನರುಜ್ಜೀವನ: ಮೈಕ್ರೋಬ್‌ಗಳು.", "ಸಸ್ಯ ಶಕ್ತಿ: ಜಡ ಶಾಖೆ 20-40%.", "ತನ ನಿಯಂತ್ರಣ: ಡ್ರೌಟ್/ಹಿಡಿತೆ."], "hi": ["पोषक अनलॉक: 30-50% अवशोषण.", "मिट्टी पुनर्जीवन: माइक्रोब्स.", "पौध शक्ति: जड़ शाखा 20-40%.", "तनाव नियंत्रण: सूखा/गर्मी."]},
        "growth_stages": {"en": ["Seedling/Transplant: Root establishment", "Vegetative: Canopy density", "Reproductive: Sustained nutrient flow", "Overall Cycle: Resilience across seasons"], "te": ["సీడ్లింగ్: రూట్ స్థాపన", "వెజిటేటివ్: కానోపీ", "రిప్రోడక్టివ్: న్యూట్రియెంట్ ఫ్లో", "సైకిల్: రెసిలియన్స్"], "kn": ["ಬೀಜಾಂಗ: ಜಡ ಸ್ಥಾಪನೆ", "ಶಾಕೀಯ: ಛತ್ರ", "ಪ್ರಜನನ: ಪೋಷಕ ಹರಿವು", "ಚಕ್ರ: ಸಹನಶೀಲತೆ"], "hi": ["बीजाणु: जड़ स्थापना", "शाकीय: छत्र", "प्रजनन: पोषक प्रवाह", "चक्र: सहनशीलता"]},
        "dosage": {"en": "Soil/Drip: 1-2 L/ha | Foliar: 2-5 ml/L", "te": "1-2 L/ha సాయిల్/డ్రిప్", "kn": "1-2 L/ha ಮಣ್ಣು/ಡ್ರಿಪ್", "hi": "1-2 L/ha मिट्टी/ड्रिप"},
        "advantages": {"en": ["22% concentrated actives - cost-effective", "Balances growth, prevents imbalances", "Versatile for all soils/crops", "15-25% vigor boost"], "te": ["22% కాన్సెంట్రేటెడ్", "బ్యాలెన్సెస్ గ్రోత్"], "kn": ["22% ಸಂಘಟಿತ", "ಸಮತೋಲಿತ ವೃದ್ಧಿ"], "hi": ["22% सांद्र", "संतुलित वृद्धि"]},
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    {
        "id": _id(), "name": "Harvix", "slug": "harvix", "category": "biostimulant",
        "image_url": f"{IMG_BASE}/6kz7k42x_harvix.png",
        "tagline": {"en": "Improves Plant Growth and Development", "te": "ప్లాంట్ గ్రోత్ అండ్ డెవలప్‌మెంట్ ఇంప్రూవర్", "kn": "ಸಸ್ಯ ವೃದ್ಧಿ ಮತ್ತು ಅಭಿವೃದ್ಧಿ ಸುಧಾರಕ", "hi": "पौध विकास और प्रगति सुधारक"},
        "overview": {"en": "Harvix, powered by 15% Ascophyllum nodosum seaweed extract, is a premium biostimulant unleashing natural growth hormones, trace minerals, and organics for peak plant performance.", "te": "హార్విక్స్, 15% ఆస్కోఫిలమ్ నోడోసమ్ సీవీడ్ ఎక్స్‌ట్రాక్ట్ ప్రీమియం బయోస్టిమ్యులెంట్.", "kn": "ಹಾರ್ವಿಕ್ಸ್, 15% ಅಸ್ಕೋಫಿಲಮ್ ನೋಡೋಸಮ್ ಸೀವೀಡ್ ಎಕ್ಸ್‌ಟ್ರಾಕ್ಟ್.", "hi": "हार्विक्स, 15% एस्कोफिलम नोडोसम सीवीड एक्सट्रैक्ट।"},
        "composition": [
            {"component": "Alginic acid (% by weight, min)", "specification": "1.5"},
            {"component": "Mannitol (% by weight, min)", "specification": "1.0"},
            {"component": "pH (10% aqueous solution)", "specification": "4.7 +/- 1.0"},
            {"component": "Specific gravity", "specification": "1.0 - 1.1"},
            {"component": "Total organic carbon (% by weight, min)", "specification": "5"}
        ],
        "how_it_works": {"en": ["Hormone Cascade: Natural auxins/cytokinins balance division/elongation.", "Root & Nutrient Boost: Alginic acid stimulates laterals and mycorrhizae.", "Photosynthesis Power: 5% organic carbon ramps rubisco activity and chlorophyll.", "Stress & Microbe Shield: Betaines protect membranes; promotes rhizosphere diversity."], "te": ["హార్మోన్ కాస్కేడ్: ఆక్సిన్స్/సైటోకినిన్స్.", "రూట్/న్యూట్రియెంట్: ఆల్జినిక్ ల్యాటరల్స్.", "ఫోటోసింథెసిస్: క్లోరోఫిల్.", "స్ట్రెస్/మైక్రోబ్: మెంబ్రేన్ షీల్డ్."], "kn": ["ಹಾರ್ಮೋನ್ ಕ್ಯಾಸ್ಕೇಡ್: ಆಕ್ಸಿನ್/ಸೈಟೋಕಿನಿನ್.", "ರೂಟ್/ಪೋಷಕ: ಅಲ್ಜಿನಿಕ್ ಲ್ಯಾಟರಲ್ಸ್.", "ಫೋಟೋಸಿಂಥೆಸಿಸ್: ಕ್ಲೋರೋಫಿಲ್.", "ಸ್ಟ್ರೆಸ್/ಮೈಕ್ರೋಬ್: ಮೆಂಬ್ರೇನ್ ರಕ್ಷಣೆ."], "hi": ["हार्मोन कैस्केड: ऑक्सिन/साइटोकिनिन.", "रूट/पोषक: एल्जिनिक लेटरल्स.", "फोटोसिंथेसिस: क्लोरोफिल.", "तनाव/माइक्रोब: झिल्ली सुरक्षा."]},
        "growth_stages": {"en": ["Vegetative: Root/shoot vigor", "Flowering: Hormone sync for profuse flowers", "Fruit Set: Retention and sizing", "Stress Recovery: Post-adversity rebound"], "te": ["వెజిటేటివ్: రూట్/షూట్", "ఫ్లవరింగ్: హార్మోన్ సింక్", "ఫ్రూట్ సెట్: రిటెన్షన్", "స్ట్రెస్ రికవరీ: రీబౌండ్"], "kn": ["ಶಾಕೀಯ: ರೂಟ್/ಶೂಟ್", "ಫ್ಲವರಿಂಗ್: ಹಾರ್ಮೋನ್ ಸಿಂಕ್", "ಫ್ರೂಟ್ ಸೆಟ್: ರಿಟೆನ್ಷನ್", "ಸ್ಟ್ರೆಸ್ ರಿಕವರಿ: ರೀಬೌಂಡ್"], "hi": ["शाकीय: रूट/शूट", "फूल: हार्मोन सिंक", "फ्रूट सेट: रिटेंशन", "स्ट्रेस रिकवरी: पुनरुद्धार"]},
        "dosage": {"en": "Foliar: 1.5 L/ha, two applications", "te": "1.5 L/ha ఫోలియార్, రెండు యాప్స్", "kn": "1.5 L/ha ಫೋಲಿಯಾರ್, ಇಬ್ಬರು", "hi": "1.5 L/ha फोलियर, दो बार"},
        "advantages": {"en": ["15% pure Ascophyllum - cold-water extracted", "Multi-stage growth enhancer", "Sustainable, residue-free", "15-25% yield improvement"], "te": ["15% ప్యూర్ ఆస్కోఫిలమ్", "మల్టీ-స్టేజ్ ఎన్‌హాన్సర్"], "kn": ["15% ಶುದ್ಧ ಅಸ್ಕೋಫಿಲಮ್", "ಬಹು-ಹಂತ ವೃದ್ಧಿ"], "hi": ["15% शुद्ध एस्कोफिलम", "बहु-चरण वृद्धि"]},
        "featured": True, "created_at": _now(), "updated_at": _now()
    },
    # Non-featured biostimulants
    {
        "id": _id(), "name": "Ardor", "slug": "ardor", "category": "biostimulant",
        "image_url": f"{IMG_BASE}/tsi665ey_ardor.png",
        "tagline": {"en": "Protein Hydrolysates 25%", "te": "ప్రోటీన్ హైడ్రోలైసేట్స్ 25%", "kn": "ಪ್ರೋಟೀನ್ ಹೈಡ್ರೋಲೈಸೇಟ್ಸ್ 25%", "hi": "प्रोटीन हाइड्रोलिसेट्स 25%"},
        "overview": {"en": "Ardor is a high-concentration protein hydrolysate biostimulant (25%) from the earth's finest sources. FCO Approved Grade for premium crop nutrition and stress recovery.", "te": "అర్డర్ 25% ప్రోటీన్ హైడ్రోలైసేట్ బయోస్టిమ్యులెంట్. FCO అప్రూవ్డ్ గ్రేడ్.", "kn": "ಅರ್ಡರ್ 25% ಪ್ರೋಟೀನ್ ಹೈಡ್ರೋಲೈಸೇಟ್. FCO ಅನುಮೋದಿತ.", "hi": "अर्डर 25% प्रोटीन हाइड्रोलिसेट। FCO अनुमोदित।"},
        "composition": [], "how_it_works": {"en": ["High-concentration amino acids for rapid stress recovery", "Promotes cell division and plant vigor", "Enhances nutrient absorption efficiency"]}, "growth_stages": {"en": ["All stages: Universal growth support"]},
        "dosage": {"en": "Foliar application as per crop requirement"}, "advantages": {"en": ["25% protein hydrolysates", "FCO Approved Grade", "From Earth's Finest sources"]},
        "featured": False, "created_at": _now(), "updated_at": _now()
    },
    {"id": _id(), "name": "Honor", "slug": "honor", "category": "biostimulant", "image_url": "", "tagline": {"en": "Premium Plant Vigor Enhancer"}, "overview": {"en": "Honor is a specialized biostimulant designed to enhance overall plant vigor and crop quality through advanced bioactive formulations."}, "composition": [], "how_it_works": {}, "growth_stages": {}, "dosage": {"en": "As per crop requirement"}, "advantages": {"en": ["Enhanced plant vigor", "Premium crop quality"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Harvix Plus", "slug": "harvix-plus", "category": "biostimulant", "image_url": "", "tagline": {"en": "Advanced Seaweed Growth Formula"}, "overview": {"en": "Harvix Plus is an advanced formulation building on Harvix technology with enhanced seaweed extracts for superior growth and yield performance."}, "composition": [], "how_it_works": {}, "growth_stages": {}, "dosage": {"en": "As per crop requirement"}, "advantages": {"en": ["Advanced seaweed formula", "Superior growth performance"]}, "featured": False, "created_at": _now(), "updated_at": _now()},

    # ===== BIOFERTILIZERS =====
    {"id": _id(), "name": "Phosurge", "slug": "phosurge", "category": "biofertilizer", "image_url": "", "tagline": {"en": "Phosphate Solubilizing Biofertilizer", "te": "ఫాస్ఫేట్ సాల్యుబిలైజింగ్ బయోఫెర్టిలైజర్", "kn": "ಫಾಸ್ಫೇಟ್ ಸಾಲ್ಯುಬಿಲೈಸಿಂಗ್ ಬಯೋಫರ್ಟಿಲೈಸರ್", "hi": "फॉस्फेट सॉल्युबिलाइजिंग बायोफर्टिलाइजर"}, "overview": {"en": "Phosurge is a potent phosphate-solubilizing biofertilizer that converts insoluble soil phosphorus into plant-available forms, reducing chemical fertilizer dependency while boosting root development and yield."}, "composition": [], "how_it_works": {"en": ["Solubilizes bound phosphorus in soil", "Enhances root development and P uptake", "Reduces chemical fertilizer dependency"]}, "growth_stages": {}, "dosage": {"en": "Soil application as recommended"}, "advantages": {"en": ["Natural phosphorus mobilization", "Cost-effective P nutrition", "Eco-friendly"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Potasurge", "slug": "potasurge", "category": "biofertilizer", "image_url": "", "tagline": {"en": "Potash Mobilizing Biofertilizer", "te": "పొటాష్ మొబిలైజింగ్ బయోఫెర్టిలైజర్", "kn": "ಪೊಟಾಷ್ ಮೊಬಿಲೈಸಿಂಗ್ ಬಯೋಫರ್ಟಿಲೈಸರ್", "hi": "पोटाश मोबिलाइजिंग बायोफर्टिलाइजर"}, "overview": {"en": "Potasurge mobilizes locked potassium in soil, making it readily available for plants. Enhances fruit quality, disease resistance, and water use efficiency."}, "composition": [], "how_it_works": {"en": ["Mobilizes bound potassium", "Improves fruit quality and firmness", "Enhances disease resistance"]}, "growth_stages": {}, "dosage": {"en": "Soil application as recommended"}, "advantages": {"en": ["Natural K mobilization", "Better fruit quality", "Disease resistance"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Germina", "slug": "germina", "category": "biofertilizer", "image_url": "", "tagline": {"en": "VAM 3000 IP/GM Mycorrhizal Biofertilizer", "te": "VAM 3000 IP/GM మైకోరైజల్ బయోఫెర్టిలైజర్", "kn": "VAM 3000 IP/GM ಮೈಕೋರೈಝಲ್ ಬಯೋಫರ್ಟಿಲೈಸರ್", "hi": "VAM 3000 IP/GM माइकोराइजल बायोफर्टिलाइजर"}, "overview": {"en": "Germina contains Vesicular Arbuscular Mycorrhizae (VAM) at 3000 IP/GM concentration, forming symbiotic root associations for enhanced phosphorus uptake and drought tolerance."}, "composition": [], "how_it_works": {"en": ["Forms mycorrhizal root associations", "Enhances phosphorus uptake 3-5x", "Improves drought tolerance"]}, "growth_stages": {}, "dosage": {"en": "Soil application at sowing/transplanting"}, "advantages": {"en": ["3000 IP/GM concentration", "Symbiotic root benefit", "Drought resilience"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Halo", "slug": "halo", "category": "biofertilizer", "image_url": "", "tagline": {"en": "Nutritional Powder Biofertilizer", "te": "న్యూట్రిషనల్ పౌడర్ బయోఫెర్టిలైజర్", "kn": "ನ್ಯೂಟ್ರಿಶನಲ್ ಪೌಡರ್ ಬಯೋಫರ್ಟಿಲೈಸರ್", "hi": "न्यूट्रिशनल पाउडर बायोफर्टिलाइजर"}, "overview": {"en": "Halo is a comprehensive nutritional powder biofertilizer that delivers essential macro and micro nutrients along with beneficial microorganisms for holistic soil and plant health."}, "composition": [], "how_it_works": {"en": ["Delivers balanced nutrition", "Supports beneficial soil microbes", "Improves soil organic matter"]}, "growth_stages": {}, "dosage": {"en": "Soil application as recommended"}, "advantages": {"en": ["Complete nutritional package", "Soil health improvement", "Easy powder application"]}, "featured": False, "created_at": _now(), "updated_at": _now()},

    # ===== LIQUID FERTILIZERS =====
    {"id": _id(), "name": "Nutrimagic CMB", "slug": "nutrimagic-cmb", "category": "liquid_fertilizer", "image_url": "", "tagline": {"en": "6-0-18 NK + Ca/Mg/B Liquid Fertilizer", "te": "6-0-18 NK + Ca/Mg/B లిక్విడ్ ఫెర్టిలైజర్", "kn": "6-0-18 NK + Ca/Mg/B ಲಿಕ್ವಿಡ್ ಫರ್ಟಿಲೈಸರ್", "hi": "6-0-18 NK + Ca/Mg/B लिक्विड फर्टिलाइजर"}, "overview": {"en": "Nutrimagic CMB is a premium liquid fertilizer with 6-0-18 NK ratio fortified with Calcium, Magnesium, and Boron for comprehensive crop nutrition and quality enhancement."}, "composition": [{"component": "N-P-K", "specification": "6-0-18"}, {"component": "Secondary nutrients", "specification": "Ca + Mg + B"}], "how_it_works": {"en": ["Balanced NK nutrition for growth", "Calcium strengthens cell walls", "Boron aids flowering and fruit set"]}, "growth_stages": {}, "dosage": {"en": "Fertigation/Drip as per crop stage"}, "advantages": {"en": ["Multi-nutrient formula", "Drip-compatible", "Premium quality"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic PRO", "slug": "nutrimagic-pro", "category": "liquid_fertilizer", "image_url": "", "tagline": {"en": "NP 7-21-0 Liquid Fertilizer"}, "overview": {"en": "Nutrimagic PRO delivers high phosphorus liquid nutrition (7-21-0) for root establishment, flowering initiation, and energy transfer in crops."}, "composition": [{"component": "N-P-K", "specification": "7-21-0"}], "how_it_works": {"en": ["High P for root development", "Energy transfer support", "Flowering promotion"]}, "growth_stages": {}, "dosage": {"en": "As per crop requirement"}, "advantages": {"en": ["High phosphorus formula", "Root development boost"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic PRIME", "slug": "nutrimagic-prime", "category": "liquid_fertilizer", "image_url": "", "tagline": {"en": "Ammonium Polyphosphate Liquid"}, "overview": {"en": "Nutrimagic PRIME is an ammonium polyphosphate-based liquid fertilizer providing slow-release phosphorus for sustained crop nutrition throughout the growth cycle."}, "composition": [{"component": "Type", "specification": "Ammonium Polyphosphate"}], "how_it_works": {"en": ["Slow-release phosphorus", "Sustained nutrition", "Improved P efficiency"]}, "growth_stages": {}, "dosage": {"en": "Fertigation as recommended"}, "advantages": {"en": ["Slow-release technology", "High P use efficiency"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic PLUS", "slug": "nutrimagic-plus", "category": "liquid_fertilizer", "image_url": "", "tagline": {"en": "NPK + Zn/B Multi-Nutrient Liquid"}, "overview": {"en": "Nutrimagic PLUS is a complete NPK liquid fertilizer enriched with Zinc and Boron for comprehensive crop nutrition addressing multiple deficiencies in one application."}, "composition": [{"component": "Type", "specification": "NPK + Zn + B"}], "how_it_works": {"en": ["Complete NPK nutrition", "Zinc for enzyme activation", "Boron for reproduction"]}, "growth_stages": {}, "dosage": {"en": "Fertigation/Foliar"}, "advantages": {"en": ["Multi-nutrient in one", "Addresses multiple deficiencies"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "KTS", "slug": "kts", "category": "liquid_fertilizer", "image_url": "", "tagline": {"en": "Potassium Thiosulphate Liquid"}, "overview": {"en": "KTS (Potassium Thiosulphate) is a dual-action liquid fertilizer providing both potassium and sulphur for fruit quality, disease resistance, and protein synthesis."}, "composition": [{"component": "Type", "specification": "Potassium Thiosulphate"}], "how_it_works": {"en": ["Dual K + S nutrition", "Fruit quality enhancement", "Protein synthesis support"]}, "growth_stages": {}, "dosage": {"en": "Fertigation as recommended"}, "advantages": {"en": ["Dual nutrient benefit", "Fruit quality boost"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic-888", "slug": "nutrimagic-888", "category": "liquid_fertilizer", "image_url": "", "tagline": {"en": "8-8-8 Balanced NPK Liquid"}, "overview": {"en": "Nutrimagic-888 provides perfectly balanced 8-8-8 NPK nutrition in liquid form, ideal for maintaining uniform growth and development across all crop stages."}, "composition": [{"component": "N-P-K", "specification": "8-8-8"}], "how_it_works": {"en": ["Perfectly balanced NPK", "Uniform growth support", "All-stage nutrition"]}, "growth_stages": {}, "dosage": {"en": "Fertigation/Drip"}, "advantages": {"en": ["Perfect NPK balance", "Versatile application"]}, "featured": False, "created_at": _now(), "updated_at": _now()},

    # ===== MICRONUTRIENTS =====
    {"id": _id(), "name": "Nutrimagic Cal", "slug": "nutrimagic-cal", "category": "micronutrient", "image_url": "", "tagline": {"en": "Calcium 11% Micronutrient", "te": "కాల్షియం 11% మైక్రోన్యూట్రియెంట్", "kn": "ಕ್ಯಾಲ್ಸಿಯಂ 11% ಮೈಕ್ರೋನ್ಯೂಟ್ರಿಯಂಟ್", "hi": "कैल्शियम 11% सूक्ष्म पोषक"}, "overview": {"en": "Nutrimagic Cal delivers 11% chelated calcium for strong cell walls, reduced fruit cracking, and improved shelf life across fruits and vegetables."}, "composition": [{"component": "Calcium (Ca)", "specification": "11%"}], "how_it_works": {"en": ["Strengthens cell walls", "Reduces fruit cracking", "Improves shelf life"]}, "growth_stages": {}, "dosage": {"en": "Foliar: 2-3 ml/L"}, "advantages": {"en": ["11% chelated calcium", "Anti-cracking", "Shelf life improvement"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic B", "slug": "nutrimagic-b", "category": "micronutrient", "image_url": "", "tagline": {"en": "Boron Ethanolamine 10%"}, "overview": {"en": "Nutrimagic B provides 10% Boron Ethanolamine for critical reproductive functions including flowering, pollen germination, and fruit set in all crops."}, "composition": [{"component": "Boron (as Ethanolamine)", "specification": "10%"}], "how_it_works": {"en": ["Essential for flowering", "Pollen germination support", "Fruit set enhancement"]}, "growth_stages": {}, "dosage": {"en": "Foliar: 1-2 ml/L"}, "advantages": {"en": ["10% Boron Ethanolamine", "Flowering support"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic Zinc", "slug": "nutrimagic-zinc", "category": "micronutrient", "image_url": "", "tagline": {"en": "Zinc 39.5% EDTA Chelated"}, "overview": {"en": "Nutrimagic Zinc delivers 39.5% EDTA-chelated zinc for enzyme activation, growth hormone synthesis, and improved photosynthesis efficiency."}, "composition": [{"component": "Zinc (Zn) EDTA", "specification": "39.5%"}], "how_it_works": {"en": ["Enzyme activation", "Growth hormone synthesis", "Photosynthesis improvement"]}, "growth_stages": {}, "dosage": {"en": "Foliar: 0.5-1 g/L"}, "advantages": {"en": ["39.5% high concentration", "EDTA chelated"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Nutrimagic Max", "slug": "nutrimagic-max", "category": "micronutrient", "image_url": "", "tagline": {"en": "Multi-Micronutrient Mixture"}, "overview": {"en": "Nutrimagic Max is a comprehensive multi-micronutrient mixture addressing Fe, Zn, Mn, Cu, B, Mo deficiencies in a single balanced formulation."}, "composition": [{"component": "Type", "specification": "Multi-micronutrient mixture (Fe, Zn, Mn, Cu, B, Mo)"}], "how_it_works": {"en": ["Addresses multiple deficiencies", "Balanced micronutrient supply", "Synergistic nutrient interaction"]}, "growth_stages": {}, "dosage": {"en": "Foliar: 2-3 g/L"}, "advantages": {"en": ["Complete micronutrient package", "Single application convenience"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Boron 20%", "slug": "boron-20", "category": "micronutrient", "image_url": "", "tagline": {"en": "Boron 20% Powder"}, "overview": {"en": "High-concentration Boron 20% powder for correcting severe boron deficiency in crops, critical for flowering, fruit set, and cell wall integrity."}, "composition": [{"component": "Boron (B)", "specification": "20%"}], "how_it_works": {"en": ["Corrects boron deficiency", "Critical for cell wall integrity", "Enhances flowering"]}, "growth_stages": {}, "dosage": {"en": "Foliar: 1 g/L"}, "advantages": {"en": ["20% high concentration", "Quick deficiency correction"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Boron 14.5%", "slug": "boron-14-5", "category": "micronutrient", "image_url": "", "tagline": {"en": "Boron 14.5% Liquid"}, "overview": {"en": "Boron 14.5% liquid formulation for convenient foliar application, ensuring optimal boron nutrition for flowering and fruit development."}, "composition": [{"component": "Boron (B)", "specification": "14.5%"}], "how_it_works": {"en": ["Easy liquid application", "Rapid boron delivery", "Flowering support"]}, "growth_stages": {}, "dosage": {"en": "Foliar: 1-2 ml/L"}, "advantages": {"en": ["Liquid convenience", "14.5% concentration"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Avantra KMS", "slug": "avantra-kms", "category": "micronutrient", "image_url": "", "tagline": {"en": "Potassium Magnesium Sulphate", "te": "పొటాషియం మెగ్నీషియం సల్ఫేట్", "kn": "ಪೊಟ್ಯಾಸಿಯಂ ಮ್ಯಾಗ್ನೀಸಿಯಂ ಸಲ್ಫೇಟ್", "hi": "पोटैशियम मैग्नीशियम सल्फेट"}, "overview": {"en": "Avantra KMS is a specialized potassium-magnesium-sulphate formulation for enhancing fruit size, color development, and sugar accumulation in high-value crops."}, "composition": [{"component": "Type", "specification": "K + Mg + S complex"}], "how_it_works": {"en": ["Potassium for fruit sizing", "Magnesium for chlorophyll", "Sulphur for protein synthesis"]}, "growth_stages": {}, "dosage": {"en": "Foliar/Fertigation as recommended"}, "advantages": {"en": ["Triple nutrient benefit", "Fruit quality enhancement", "Color development"]}, "featured": False, "created_at": _now(), "updated_at": _now()},

    # ===== 100% WATER SOLUBLE =====
    {"id": _id(), "name": "Growth 13-40-13", "slug": "growth-13-40-13", "category": "water_soluble", "image_url": "", "tagline": {"en": "13-40-13 High Phosphorus WSF", "te": "13-40-13 హై ఫాస్ఫరస్ WSF", "kn": "13-40-13 ಹೈ ಫಾಸ್ಫರಸ್ WSF", "hi": "13-40-13 हाई फॉस्फोरस WSF"}, "overview": {"en": "Growth 13-40-13 is a 100% water-soluble fertilizer with high phosphorus content for root establishment, early vigor, and flowering initiation in all crops."}, "composition": [{"component": "N-P-K", "specification": "13-40-13"}], "how_it_works": {"en": ["High P for root development", "Energy transfer in plants", "Flowering initiation"]}, "growth_stages": {}, "dosage": {"en": "Fertigation: 2-5 g/L"}, "advantages": {"en": ["100% water soluble", "High phosphorus", "Root establishment"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Yield 6-12-36", "slug": "yield-6-12-36", "category": "water_soluble", "image_url": "", "tagline": {"en": "6-12-36 High Potash WSF", "te": "6-12-36 హై పొటాష్ WSF", "kn": "6-12-36 ಹೈ ಪೊಟಾಷ್ WSF", "hi": "6-12-36 हाई पोटाश WSF"}, "overview": {"en": "Yield 6-12-36 is a 100% water-soluble fertilizer with high potassium for fruit filling, quality enhancement, and sugar accumulation during reproductive stages."}, "composition": [{"component": "N-P-K", "specification": "6-12-36"}], "how_it_works": {"en": ["High K for fruit filling", "Sugar accumulation", "Quality enhancement"]}, "growth_stages": {}, "dosage": {"en": "Fertigation: 2-5 g/L"}, "advantages": {"en": ["100% water soluble", "High potassium", "Fruit quality"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "MAP 12-61-0", "slug": "map-12-61-0", "category": "water_soluble", "image_url": "", "tagline": {"en": "12-61-0 Mono Ammonium Phosphate"}, "overview": {"en": "MAP 12-61-0 is a 100% water-soluble mono ammonium phosphate fertilizer providing ultra-high phosphorus for critical root development and energy transfer."}, "composition": [{"component": "N-P-K", "specification": "12-61-0"}], "how_it_works": {"en": ["Ultra-high phosphorus delivery", "Root system establishment", "Energy metabolism support"]}, "growth_stages": {}, "dosage": {"en": "Fertigation: 1-3 g/L"}, "advantages": {"en": ["61% P2O5", "100% soluble", "Root powerhouse"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
    {"id": _id(), "name": "Bud Bloom 0-37-37", "slug": "bud-bloom", "category": "water_soluble", "image_url": "", "tagline": {"en": "0-37-37+0.2B Flowering & Fruiting WSF", "te": "0-37-37+0.2B ఫ్లవరింగ్ & ఫ్రూటింగ్ WSF", "kn": "0-37-37+0.2B ಫ್ಲವರಿಂಗ್ & ಫ್ರೂಟಿಂಗ್ WSF", "hi": "0-37-37+0.2B फ्लावरिंग & फ्रूटिंग WSF"}, "overview": {"en": "Bud Bloom 0-37-37+0.2B is a specialized 100% water-soluble fertilizer with balanced PK and added Boron, specifically designed for bud development, flowering, and fruit set."}, "composition": [{"component": "N-P-K + B", "specification": "0-37-37 + 0.2% B"}], "how_it_works": {"en": ["Balanced P+K for reproduction", "Boron aids bud break", "Enhanced fruit set and sizing"]}, "growth_stages": {}, "dosage": {"en": "Fertigation: 2-4 g/L at flowering"}, "advantages": {"en": ["Balanced PK + Boron", "Flowering specialist", "100% water soluble"]}, "featured": False, "created_at": _now(), "updated_at": _now()},
]
