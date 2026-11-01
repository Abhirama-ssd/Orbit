import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const api = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
};

const pageText = {
  en: {
    Overview: "Your learning, at a glance",
    Learn: "Build understanding, one idea at a time",
    Solve: "Practice made for you",
    Test: "Show what you know",
    Subjects: "Your subject rooms",
    Assignments: "Everything you need to finish",
    Messages: "Stay connected with your class",
    Rewards: "Every small win counts",
    Progress: "A clear picture of progress",
    "My child": "A little more insight, every day",
    Attendance: "Showing up is a superpower",
    Dictionary: "Words you've discovered",
    Handbooks: "Quick guides for every subject",
    "Word Discovery": "Find a new word every day",
    Roster: "Every learner in your classroom",
    Verification: "Celebrate verified mastery",
    "Teacher inbox": "One place for every conversation",
    Classroom: "Your class, moving forward",
    "Review work": "Thoughtful feedback makes a difference",
    Workspace: "Workspace",
    "GOOD TO SEE YOU AGAIN,": "GOOD TO SEE YOU AGAIN,",
    "WELCOME BACK,": "WELCOME BACK,",
    "A NEW DAY TO INSPIRE,": "A NEW DAY TO INSPIRE,"
  },
  hi: {
    Overview: "आपकी सीख का सारांश",
    Learn: "एक-एक विचार को समझें",
    Solve: "आपके लिए प्रैक्टिस",
    Test: "अपना ज्ञान दिखाएँ",
    Subjects: "आपके विषय कक्ष",
    Assignments: "पूरा करने के लिए सब कुछ",
    Messages: "क्लास से जुड़े रहें",
    Rewards: "हर छोटी जीत का महत्व",
    Progress: "प्रगति का स्पष्ट चित्र",
    "My child": "आपके बच्चे की प्रगति",
    Attendance: "उपस्थित रहना सबसे बड़ी ताकत है",
    Dictionary: "आपके खोजे हुए शब्द",
    Handbooks: "हर विषय के लिए त्वरित मार्गदर्शिका",
    "Word Discovery": "हर दिन एक नया शब्द",
    Roster: "आपकी कक्षा के सभी विद्यार्थी",
    Verification: "उपलब्धियों का सत्यापन",
    "Teacher inbox": "सभी संदेश एक जगह",
    Classroom: "आपका कक्षा अनुभव",
    "Review work": "सोच-समझकर फीडबैक",
    Workspace: "कार्यक्षेत्र",
    "GOOD TO SEE YOU AGAIN,": "आपका फिर से स्वागत है,",
    "WELCOME BACK,": "वापसी पर स्वागत है,",
    "A NEW DAY TO INSPIRE,": "आज एक नया दिन, प्रेरणा के लिए,"
  },
  ta: {
    Overview: "உங்கள் கற்றல் சுருக்கம்",
    Learn: "ஒவ்வொரு கருத்தையும் புரிந்து கற்றுக்கொள்ளுங்கள்",
    Solve: "உங்களுக்காகப் பயிற்சி",
    Test: "உங்கள் அறிவை காட்டுங்கள்",
    Subjects: "உங்கள் பாடங்கள்",
    Assignments: "முடிக்க வேண்டியவை",
    Messages: "வகுப்புடன் இணைந்திருங்கள்",
    Rewards: "ஒவ்வொரு சிறிய வெற்றியும் முக்கியம்",
    Progress: "முன்னேற்றம் தெளிவாக",
    "My child": "உங்கள் குழந்தையின் முன்னேற்றம்",
    Attendance: "வருகைதான் சிறந்த சக்தி",
    Dictionary: "நீங்கள் கண்டறிந்த சொற்கள்",
    Handbooks: "ஒவ்வொரு பாடத்திற்குமான விரைவு வழிகாட்டிகள்",
    "Word Discovery": "ஒவ்வொரு நாளும் ஒரு புதிய சொல்",
    Roster: "உங்கள் வகுப்பின் அனைத்து மாணவர்களும்",
    Verification: "சரிபார்க்கப்பட்ட சாதனைகள்",
    "Teacher inbox": "அனைத்து செய்திகளும் ஒரே இடத்தில்",
    Classroom: "உங்கள் வகுப்பறை",
    "Review work": "சிந்தனையுடன் கருத்து",
    Workspace: "வேலைப் பகுதி",
    "GOOD TO SEE YOU AGAIN,": "மீண்டும் சந்தித்ததில் மகிழ்ச்சி,",
    "WELCOME BACK,": "மீண்டும் வரவேற்கிறோம்,",
    "A NEW DAY TO INSPIRE,": "மீண்டும் ஒரு புதிய நாள், ஊக்கமளிக்க,"
  },
  te: {
    Overview: "మీ అభ్యాసం ఒక చూపులో",
    Learn: "ఒక్కో భావనను అర్థం చేసుకోండి",
    Solve: "మీ కోసం అభ్యాసం",
    Test: "మీకు తెలిసినది చూపండి",
    Subjects: "మీ విషయాలు",
    Assignments: "పూర్తి చేయాల్సిన పనులు",
    Messages: "మీ తరగతితో అనుసంధానంగా ఉండండి",
    Rewards: "ప్రతి చిన్న విజయం ముఖ్యం",
    Progress: "మీ పురోగతి",
    "My child": "మీ పిల్లల అభ్యాసం",
    Attendance: "హాజరు మరియు అభ్యాస సమయం",
    Dictionary: "మీరు కనుగొన్న పదాలు",
    Handbooks: "ప్రతి విషయానికి త్వరిత మార్గదర్శకాలు",
    "Word Discovery": "ప్రతిరోజూ ఒక కొత్త పదం",
    Roster: "మీ తరగతి విద్యార్థులు",
    Verification: "సాధనల ధృవీకరణ",
    "Teacher inbox": "అన్ని సంభాషణలు ఒకే చోట",
    Classroom: "మీ తరగతి ముందుకు సాగుతోంది",
    "Review work": "విద్యార్థుల పనిని సమీక్షించండి",
    Workspace: "పని ప్రదేశం",
    "GOOD TO SEE YOU AGAIN,": "మిమ్మల్ని మళ్లీ చూడటం ఆనందంగా ఉంది,",
    "WELCOME BACK,": "తిరిగి స్వాగతం,",
    "A NEW DAY TO INSPIRE,": "ప్రేరణ కలిగించే కొత్త రోజు,"
  },
  kn: {
    Overview: "ನಿಮ್ಮ ಕಲಿಕೆಯ ಒಂದು ನೋಟ",
    Learn: "ಒಂದೊಂದು ಕಲ್ಪನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
    Solve: "ನಿಮಗಾಗಿ ಅಭ್ಯಾಸ",
    Test: "ನಿಮಗೆ ತಿಳಿದಿರುವುದನ್ನು ತೋರಿಸಿ",
    Subjects: "ನಿಮ್ಮ ವಿಷಯಗಳು",
    Assignments: "ಪೂರ್ಣಗೊಳಿಸಬೇಕಾದ ಕೆಲಸಗಳು",
    Messages: "ನಿಮ್ಮ ತರಗತಿಯೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ",
    Rewards: "ಪ್ರತಿ ಸಣ್ಣ ಗೆಲುವೂ ಮುಖ್ಯ",
    Progress: "ನಿಮ್ಮ ಪ್ರಗತಿ",
    "My child": "ನಿಮ್ಮ ಮಗುವಿನ ಕಲಿಕೆ",
    Attendance: "ಹಾಜರಾತಿ ಮತ್ತು ಕಲಿಕೆಯ ಸಮಯ",
    Dictionary: "ನೀವು ಕಂಡುಕೊಂಡ ಪದಗಳು",
    Handbooks: "ಪ್ರತಿ ವಿಷಯಕ್ಕೂ ತ್ವರಿತ ಮಾರ್ಗದರ್ಶಿಗಳು",
    "Word Discovery": "ಪ್ರತಿದಿನ ಒಂದು ಹೊಸ ಪದ",
    Roster: "ನಿಮ್ಮ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳು",
    Verification: "ಸಾಧನೆಗಳ ಪರಿಶೀಲನೆ",
    "Teacher inbox": "ಎಲ್ಲಾ ಸಂಭಾಷಣೆಗಳು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ",
    Classroom: "ನಿಮ್ಮ ತರಗತಿ ಮುಂದುವರಿಯುತ್ತಿದೆ",
    "Review work": "ವಿದ್ಯಾರ್ಥಿಗಳ ಕೆಲಸ ಪರಿಶೀಲಿಸಿ",
    Workspace: "ಕಾರ್ಯಕ್ಷೇತ್ರ",
    "GOOD TO SEE YOU AGAIN,": "ಮತ್ತೆ ನಿಮ್ಮನ್ನು ನೋಡಲು ಸಂತೋಷವಾಗಿದೆ,",
    "WELCOME BACK,": "ಮತ್ತೆ ಸ್ವಾಗತ,",
    "A NEW DAY TO INSPIRE,": "ಸ್ಫೂರ್ತಿ ನೀಡುವ ಹೊಸ ದಿನ,"
  },
  ml: {
    Overview: "നിങ്ങളുടെ പഠനം ഒറ്റനോട്ടത്തിൽ",
    Learn: "ഓരോ ആശയവും മനസ്സിലാക്കാം",
    Solve: "നിങ്ങൾക്കായുള്ള പരിശീലനം",
    Test: "നിങ്ങളുടെ അറിവ് തെളിയിക്കൂ",
    Subjects: "നിങ്ങളുടെ വിഷയങ്ങൾ",
    Assignments: "പൂർത്തിയാക്കാനുള്ള കാര്യങ്ങൾ",
    Messages: "ക്ലാസുമായി ബന്ധം നിലനിർത്തൂ",
    Rewards: "ഓരോ ചെറിയ വിജയവും പ്രധാനമാണ്",
    Progress: "നിങ്ങളുടെ പുരോഗതി",
    "My child": "നിങ്ങളുടെ കുട്ടിയുടെ പഠനം",
    Attendance: "ഹാജരും പഠനസമയവും",
    Dictionary: "നിങ്ങൾ കണ്ടെത്തിയ വാക്കുകൾ",
    Handbooks: "ഓരോ വിഷയത്തിനും ദ്രുത പഠനസഹായികൾ",
    "Word Discovery": "എല്ലാ ദിവസവും ഒരു പുതിയ വാക്ക്",
    Roster: "നിങ്ങളുടെ ക്ലാസിലെ വിദ്യാർത്ഥികൾ",
    Verification: "നേട്ടങ്ങൾ സ്ഥിരീകരിക്കുക",
    "Teacher inbox": "എല്ലാ സംഭാഷണങ്ങളും ഒരിടത്ത്",
    Classroom: "നിങ്ങളുടെ ക്ലാസ് മുന്നേറുന്നു",
    "Review work": "വിദ്യാർത്ഥികളുടെ ജോലി പരിശോധിക്കുക",
    Workspace: "പ്രവർത്തനമേഖല",
    "GOOD TO SEE YOU AGAIN,": "വീണ്ടും കാണുന്നതിൽ സന്തോഷം,",
    "WELCOME BACK,": "തിരികെ സ്വാഗതം,",
    "A NEW DAY TO INSPIRE,": "പ്രചോദനമേകുന്ന പുതിയ ദിവസം,"
  }
};
const navByRole = {
  student: ["Overview", "Learn", "Solve", "Test", "Subjects", "Dictionary", "Handbooks", "Word Discovery", "Assignments", "Messages", "Rewards"],
  parent: ["My child", "Progress", "Attendance", "Messages"],
  teacher: ["Classroom", "Roster", "Teacher inbox", "Review work", "Verification", "Progress"]
};
const student = {
  Overview: "◫", Learn: "✳", Solve: "⌁", Test: "◷", Subjects: "▦", Assignments: "☷", Messages: "✉", Rewards: "✦",
  Progress: "◒", "My child": "⌂", Attendance: "✓", Dictionary: "Aa", Handbooks: "▤", "Word Discovery": "✧",
  Roster: "♙", Verification: "✓", "Teacher inbox": "✉", Classroom: "▦", "Review work": "☷"
};
const languageOptions = ["en", "hi", "te", "ta", "kn", "ml"];
const languageLabels = { en: "English", hi: "हिन्दी", te: "తెలుగు", ta: "தமிழ்", kn: "ಕನ್ನಡ", ml: "മലയാളം" };
const loginLabels = {
  en: { welcome: "Welcome back", subtitle: "Sign in to pick up where you left off.", username: "Username / ID", password: "Password / PIN", usernamePlaceholder: "e.g. STU-2026-014", passwordPlaceholder: "Enter your password or PIN", submit: "Let me in", signingIn: "Signing you in…" },
  hi: { welcome: "वापसी पर स्वागत है", subtitle: "आगे बढ़ने के लिए साइन इन करें।", username: "उपयोगकर्ता नाम / आईडी", password: "पासवर्ड / पिन", usernamePlaceholder: "जैसे STU-2026-014", passwordPlaceholder: "अपना पासवर्ड या पिन दर्ज करें", submit: "लॉग इन करें", signingIn: "लॉग इन हो रहा है…" },
  te: { welcome: "తిరిగి స్వాగతం", subtitle: "మీ అభ్యాసాన్ని కొనసాగించడానికి సైన్ ఇన్ చేయండి.", username: "వినియోగదారు పేరు / ID", password: "పాస్‌వర్డ్ / PIN", usernamePlaceholder: "ఉదా. STU2026101", passwordPlaceholder: "మీ పాస్‌వర్డ్ లేదా PIN నమోదు చేయండి", submit: "ప్రవేశించండి", signingIn: "ప్రవేశిస్తున్నారు…" },
  ta: { welcome: "மீண்டும் வரவேற்கிறோம்", subtitle: "தொடர்ந்து கற்க உள்நுழையுங்கள்.", username: "பயனர் பெயர் / ID", password: "கடவுச்சொல் / PIN", usernamePlaceholder: "எ.கா. STU2026101", passwordPlaceholder: "கடவுச்சொல் அல்லது PIN உள்ளிடவும்", submit: "உள்நுழைக", signingIn: "உள்நுழைகிறது…" },
  kn: { welcome: "ಮತ್ತೆ ಸ್ವಾಗತ", subtitle: "ನಿಮ್ಮ ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.", username: "ಬಳಕೆದಾರ ಹೆಸರು / ID", password: "ಪಾಸ್‌ವರ್ಡ್ / PIN", usernamePlaceholder: "ಉದಾ. STU2026101", passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ PIN ನಮೂದಿಸಿ", submit: "ಪ್ರವೇಶಿಸಿ", signingIn: "ಪ್ರವೇಶಿಸಲಾಗುತ್ತಿದೆ…" },
  ml: { welcome: "തിരികെ സ്വാഗതം", subtitle: "പഠനം തുടരാൻ സൈൻ ഇൻ ചെയ്യൂ.", username: "ഉപയോക്തൃനാമം / ID", password: "പാസ്‌വേഡ് / PIN", usernamePlaceholder: "ഉദാ. STU2026101", passwordPlaceholder: "പാസ്‌വേഡ് അല്ലെങ്കിൽ PIN നൽകുക", submit: "പ്രവേശിക്കുക", signingIn: "പ്രവേശിക്കുന്നു…" }
};
const navLabels = {
  en: { Overview: "Overview", Learn: "Learn", Solve: "Solve", Test: "Test", Subjects: "Subjects", Dictionary: "Dictionary", Handbooks: "Handbooks", "Word Discovery": "Word Discovery", Assignments: "Assignments", Messages: "Messages", Rewards: "Rewards", Progress: "Progress", "My child": "My child", Attendance: "Attendance", Roster: "Roster", Verification: "Verification", "Teacher inbox": "Teacher inbox", Classroom: "Classroom", "Review work": "Review work" },
  hi: { Overview: "अवलोकन", Learn: "सीखें", Solve: "अभ्यास", Test: "परीक्षा", Subjects: "विषय", Dictionary: "शब्दकोश", Handbooks: "अध्ययन पुस्तिका", "Word Discovery": "शब्द खोज", Assignments: "कार्य", Messages: "संदेश", Rewards: "पुरस्कार", Progress: "प्रगति", "My child": "मेरा बच्चा", Attendance: "उपस्थिति", Roster: "छात्र सूची", Verification: "सत्यापन", "Teacher inbox": "शिक्षक संदेश", Classroom: "कक्षा", "Review work": "कार्य समीक्षा" },
  te: { Overview: "సారాంశం", Learn: "నేర్చుకోండి", Solve: "అభ్యాసం", Test: "పరీక్ష", Subjects: "విషయాలు", Dictionary: "పదకోశం", Handbooks: "అధ్యయన పుస్తకాలు", "Word Discovery": "పదాల అన్వేషణ", Assignments: "పనులు", Messages: "సందేశాలు", Rewards: "బహుమతులు", Progress: "పురోగతి", "My child": "నా బిడ్డ", Attendance: "హాజరు", Roster: "విద్యార్థుల జాబితా", Verification: "ధృవీకరణ", "Teacher inbox": "ఉపాధ్యాయ సందేశాలు", Classroom: "తరగతి గది", "Review work": "పనుల సమీక్ష" },
  ta: { Overview: "கண்ணோட்டம்", Learn: "கற்றல்", Solve: "பயிற்சி", Test: "தேர்வு", Subjects: "பாடங்கள்", Dictionary: "அகராதி", Handbooks: "கையேடுகள்", "Word Discovery": "சொல் கண்டுபிடிப்பு", Assignments: "பணிகள்", Messages: "செய்திகள்", Rewards: "வெகுமதிகள்", Progress: "முன்னேற்றம்", "My child": "என் குழந்தை", Attendance: "வருகை", Roster: "மாணவர் பட்டியல்", Verification: "சரிபார்ப்பு", "Teacher inbox": "ஆசிரியர் செய்திகள்", Classroom: "வகுப்பறை", "Review work": "பணிகளை மதிப்பாய்வு" },
  kn: { Overview: "ಅವಲೋಕನ", Learn: "ಕಲಿಯಿರಿ", Solve: "ಅಭ್ಯಾಸ", Test: "ಪರೀಕ್ಷೆ", Subjects: "ವಿಷಯಗಳು", Dictionary: "ನಿಘಂಟು", Handbooks: "ಕೈಪಿಡಿಗಳು", "Word Discovery": "ಪದ ಅನ್ವೇಷಣೆ", Assignments: "ಕಾರ್ಯಗಳು", Messages: "ಸಂದೇಶಗಳು", Rewards: "ಬಹುಮಾನಗಳು", Progress: "ಪ್ರಗತಿ", "My child": "ನನ್ನ ಮಗು", Attendance: "ಹಾಜರಾತಿ", Roster: "ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿ", Verification: "ಪರಿಶೀಲನೆ", "Teacher inbox": "ಶಿಕ್ಷಕರ ಸಂದೇಶಗಳು", Classroom: "ತರಗತಿ", "Review work": "ಕೆಲಸದ ಪರಿಶೀಲನೆ" },
  ml: { Overview: "അവലോകനം", Learn: "പഠിക്കാം", Solve: "പരിശീലനം", Test: "പരീക്ഷ", Subjects: "വിഷയങ്ങൾ", Dictionary: "നിഘണ്ടു", Handbooks: "കൈപ്പുസ്തകങ്ങൾ", "Word Discovery": "വാക്ക് കണ്ടെത്തൽ", Assignments: "അസൈൻമെന്റുകൾ", Messages: "സന്ദേശങ്ങൾ", Rewards: "സമ്മാനങ്ങൾ", Progress: "പുരോഗതി", "My child": "എന്റെ കുട്ടി", Attendance: "ഹാജർ", Roster: "വിദ്യാർത്ഥിപ്പട്ടിക", Verification: "സ്ഥിരീകരണം", "Teacher inbox": "അധ്യാപക സന്ദേശങ്ങൾ", Classroom: "ക്ലാസ് മുറി", "Review work": "ജോലി അവലോകനം" }
};
const getText = (key, language = "en") => pageText[language]?.[key] || pageText.en[key] || key;
const getNavText = (item, language = "en") => navLabels[language]?.[item] || item;
const getWelcomeText = (role, language = "en") => getText({ student: "GOOD TO SEE YOU AGAIN,", parent: "WELCOME BACK,", teacher: "A NEW DAY TO INSPIRE," }[role] || "WELCOME BACK,", language);

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("orbit-user")); } catch { return null; }
  });
  const [page, setPage] = useState("Overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [milestoneLevel, setMilestoneLevel] = useState(0);
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem("orbit-language") || "en"; } catch { return "en"; }
  });
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("orbit-theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((registrationError) => {
        console.error("Offline app caching could not be enabled.", registrationError);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orbit-language", language);
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    localStorage.setItem("orbit-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!user || user.role !== "student") return undefined;
    const key = `orbit-usage-${user.id}`;
    const recordUsage = (addMinute = false) => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const usage = JSON.parse(localStorage.getItem(key) || '{"days":[],"activeMinutes":0,"minutesByDay":{}}');
        usage.days = Array.isArray(usage.days) ? usage.days : [];
        usage.minutesByDay = usage.minutesByDay || {};
        if (!usage.days.includes(today)) usage.days.unshift(today);
        usage.days = usage.days.slice(0, 30);
        if (addMinute) {
          usage.activeMinutes = (Number(usage.activeMinutes) || 0) + 1;
          usage.minutesByDay[today] = (Number(usage.minutesByDay[today]) || 0) + 1;
        }
        localStorage.setItem(key, JSON.stringify(usage));
      } catch (usageError) {
        console.error("App attendance could not be saved.", usageError);
        setError("App attendance could not be saved on this device.");
      }
    };
    recordUsage();
    const timer = setInterval(() => recordUsage(true), 60000);
    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    api(`/dashboard/${user.role}`).then((dashboardData) => {
      if (user.role === "student") {
        try {
          const progressKey = `orbit-student-progress-${user.id}`;
          const legacyProgress = user.id === "STU-2026-014" ? localStorage.getItem("orbit-student-progress") : null;
          const persistentProgress = JSON.parse(localStorage.getItem(progressKey) || legacyProgress || "{}");
          const nextData = {
            ...dashboardData,
            ...persistentProgress,
            badges: Array.from(new Set([...(dashboardData.badges || []), ...(persistentProgress.badges || [])])),
            credits: Number(persistentProgress.credits || dashboardData.credits || 0)
          };
          setData(nextData);
          return;
        } catch (errorState) {
          console.error("Student progress could not be restored.", errorState);
        }
      }
      setData(dashboardData);
    }).catch((err) => setError(err.message));
    setPage(user.role === "student" ? "Overview" : user.role === "parent" ? "My child" : "Classroom");
  }, [user]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const signOut = () => {
    localStorage.removeItem("orbit-user");
    setUser(null);
    setData(null);
    setProfileOpen(false);
    setMilestoneLevel(0);
  };
  const saveUser = (next) => {
    localStorage.setItem("orbit-user", JSON.stringify(next));
    setUser(next);
    setProfileOpen(false);
    setToast("Your profile details have been saved.");
  };
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setToast(`Language changed to ${languageLabels[nextLanguage]}.`);
  };
  const cycleTheme = () => {
    const themes = ["dark", "light", "gold"];
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };
  const awardStudentCredits = (creditsEarned, badgeMessage) => {
    if (!user || user.role !== "student") return;
    const currentCredits = Number(data?.credits) || 0;
    const nextLevel = Math.min(5, Math.floor((currentCredits + creditsEarned) / 45) + 1);
    const previousLevel = Math.min(5, Math.floor(currentCredits / 45) + 1);
    if (nextLevel > previousLevel) setMilestoneLevel(nextLevel);
    setData((current) => {
      if (!current) return current;
      const updated = {
        ...current,
        credits: (Number(current.credits) || 0) + creditsEarned,
        points: (Number(current.points) || 0) + Math.max(10, creditsEarned),
        level: Math.min(5, Math.floor(((Number(current.credits) || 0) + creditsEarned) / 45) + 1),
        badges: Array.from(new Set([...(current.badges || []), ...getUnlockedBadges((Number(current.credits) || 0) + creditsEarned)]))
      };
      localStorage.setItem(`orbit-student-progress-${user.id}`, JSON.stringify({
        badges: updated.badges,
        credits: updated.credits,
        points: updated.points,
        level: updated.level
      }));
      return updated;
    });
    if (badgeMessage) setToast(badgeMessage);
  };
  if (!user) return <Login onLogin={(next) => { localStorage.setItem("orbit-user", JSON.stringify(next)); setUser(next); }} language={language} onLanguageChange={setLanguage} theme={theme} onThemeChange={cycleTheme} />;
  if (!data) return <div className="loading-screen"><span className="orbit-mark">o</span><p>{error || "Getting your space ready…"}</p>{error && <button className="text-button" onClick={signOut}>Back to sign in</button>}</div>;

  const nav = navByRole[user.role] || navByRole.student;
  const navLabel = (item) => getNavText(item, language);
  const pageDescription = pageText[language]?.[page] || pageText.en[page] || "A little progress, every day.";
  const pageTitle = navLabel(page);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setPage(nav[0]); }}><span className="brand-icon">o</span><span>orbit<span className="brand-dot">.</span></span></a>
        <div className="school-switch"><div className="school-monogram">S</div><div><strong>Sunrise Public School</strong><small>New Delhi, India</small></div><span className="chevron">⌄</span></div>
        <div className="nav-caption">{getText("Workspace", language).toUpperCase()}</div>
        <nav className="nav-list" aria-label="Main navigation">
          {nav.map((item) => <button key={item} className={`nav-item ${page === item ? "active" : ""}`} onClick={() => setPage(item)}><span className="nav-icon">{student[item]}</span><span>{navLabel(item)}</span>{item === "Teacher inbox" && <span className="nav-count">2</span>}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        {user.role === "student" && <div className="streak-card"><div className="streak-icon">✦</div><div><strong>{data.streak}-day streak</strong><small>You're on a roll!</small></div><span>↗</span></div>}
        <button className="help-card" onClick={() => setToast("Your class teacher is here if you need a hand.")}><span className="help-icon">?</span><span><strong>Need a hand?</strong><small>We're here for you</small></span><span className="help-arrow">↗</span></button>
        <button className="profile-button" onClick={() => setProfileOpen(true)}><span className="avatar">{initials(user.name)}</span><span className="profile-meta"><strong>{user.name} {user.role === "student" && <AcademicTier score={data.mastery} />}</strong><small>{roleLabel(user.role)}{user.className ? ` · Class ${user.className}${user.section}` : ""}</small></span><span className="dots">···</span></button>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-icon">o</span> orbit<span className="brand-dot">.</span></div>
          <div className="breadcrumbs"><span>{getText("Workspace", language)}</span><span className="slash">/</span><strong>{pageTitle}</strong></div>
          <div className="top-actions"><span className="live-date">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span><select className="language-select" value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label="Choose language">{languageOptions.map((option) => <option key={option} value={option}>{languageLabels[option]}</option>)}</select><button className="theme-toggle" onClick={cycleTheme} aria-label={`Switch theme; current theme is ${theme === "gold" ? "Black and Gold" : theme}`}>{theme === "dark" ? "◐" : theme === "light" ? "☼" : "✦"}<span>{theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Black & Gold"}</span></button><button className="icon-button notification-button" onClick={() => setToast(user.role === "teacher" ? "You have 2 messages to review." : "You're all caught up.")} aria-label="Notifications">♧<i /></button><span className="avatar top-avatar">{initials(user.name)}</span></div>
        </header>
        <section className="page-content">
          <div className="page-heading"><div><div className="eyebrow">{getWelcomeText(user.role, language)} <span className="wave">✦</span></div><h1>{pageTitle}</h1><p>{pageDescription}</p></div><div className="heading-date"><span className="date-icon">◷</span><div><strong>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</strong><small>Make today a good one</small></div></div></div>
          {error && <div className="inline-error">{error}<button onClick={() => setError("")}>×</button></div>}
          {user.role === "student" && <StudentPage page={page} data={data} user={user} setPage={setPage} notify={setToast} onReward={awardStudentCredits} />}
          {user.role === "parent" && <ParentPage page={page} data={data} user={user} notify={setToast} />}
          {user.role === "teacher" && <TeacherPage page={page} data={data} notify={setToast} />}
        </section>
      </main>
      {user.role === "student" && <Assistant user={user} notify={setToast} setPage={setPage} />}
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
      {profileOpen && <ProfileModal user={user} score={data.mastery} onClose={() => setProfileOpen(false)} onSignOut={signOut} onSave={saveUser} />}
      {milestoneLevel > 0 && <MilestoneModal level={milestoneLevel} onClose={() => setMilestoneLevel(0)} />}
    </div>
  );
}

function Login({ onLogin, language, onLanguageChange, theme, onThemeChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const copy = loginLabels[language] || loginLabels.en;
  const role = /^STU-?\d/i.test(username) ? "Student" : /^PAR-?\d/i.test(username) ? "Parent" : /^TCH-?\d/i.test(username) ? "Teacher" : "";
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const { user: next } = await api("/login", { method: "POST", body: JSON.stringify({ username, password }) });
      onLogin(next);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const useDemo = (id) => { setUsername(id); setPassword("1234"); setError(""); };
  return <main className="login-screen"><div className="login-decor decor-one" /><div className="login-decor decor-two" />
    <div className="login-panel">
      <div className="login-utilities"><select className="language-select" value={language} onChange={(event) => onLanguageChange(event.target.value)} aria-label="Choose language">{languageOptions.map((option) => <option key={option} value={option}>{languageLabels[option]}</option>)}</select><button className="theme-toggle" onClick={onThemeChange} aria-label={`Switch theme; current theme is ${theme === "gold" ? "Black and Gold" : theme}`}>{theme === "dark" ? "◐" : theme === "light" ? "☼" : "✦"}<span>{theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Black & Gold"}</span></button></div>
      <div className="login-brand"><span className="brand-icon">o</span><span>orbit<span className="brand-dot">.</span></span><span className="login-tag">LEARNING, IN YOUR ORBIT</span></div>
      <div className="login-copy"><div className="eyebrow">A brighter way to learn <span className="wave">✦</span></div><h1>Your next big<br /><span>aha!</span> moment starts here.</h1><p>One little step today. A whole lot of possibility tomorrow.</p></div>
      <div className="login-card"><div className="login-card-head"><div><h2>{copy.welcome}</h2><p>{copy.subtitle}</p></div><span className="login-sparkle">✳</span></div>
        <form onSubmit={submit}><label htmlFor="username">{copy.username}</label><div className="input-wrap"><span className="input-icon">⌑</span><input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={copy.usernamePlaceholder} autoComplete="username" required /><span className={`detected-role ${role ? "show" : ""}`}>{role}</span></div><label htmlFor="password">{copy.password}</label><div className="input-wrap"><span className="input-icon">⌑</span><input id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={copy.passwordPlaceholder} type="password" autoComplete="current-password" required /></div>
          {error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button login-submit" disabled={busy}>{busy ? copy.signingIn : copy.submit}<span>↗</span></button>
        </form>
        <div className="demo-area"><div className="demo-divider"><span>TRY A DEMO ACCOUNT</span></div><div className="demo-buttons"><button onClick={() => useDemo("STU-2026-014")}><span className="demo-dot violet-dot" />Student</button><button onClick={() => useDemo("PAR-2026-014")}><span className="demo-dot gold-dot" />Parent</button><button onClick={() => useDemo("TCH-2048")}><span className="demo-dot mint-dot" />Teacher</button></div><small>Demo PIN: <b>1234</b> <span>·</span> Your role is detected automatically</small></div>
      </div>
      <div className="login-foot"><span>Made for curious minds in Classes 6–10</span><span>✦ &nbsp; Learning feels better together</span></div>
    </div>
    <aside className="login-visual"><div className="visual-top"><span>✦ A SPACE TO GROW</span><span>06 — 10</span></div><div className="visual-art"><div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" /><div className="art-orbit orbit-c" /><div className="planet"><span>o</span></div><div className="art-star star-a">✦</div><div className="art-star star-b">✧</div><div className="art-star star-c">·</div><div className="art-label label-one"><span className="label-dot" /> YOUR PACE</div><div className="art-label label-two"><span className="label-dot mint-label" /> YOUR PATH</div></div><div className="visual-bottom"><h2>Learning that<br />gets <em>you.</em></h2><p>Little lessons. Big confidence.<br />A classroom that moves with you.</p><div className="visual-pagination"><span className="page-dot active-page" /><span className="page-dot" /><span className="page-dot" /></div></div></aside>
  </main>;
}

function StudentPage({ page, data, user, setPage, notify, onReward }) {
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [activeRoomTool, setActiveRoomTool] = useState("");
  if (page === "Overview") return <>
    <div className="welcome-banner"><div className="banner-copy"><span className="banner-kicker">YOUR LEARNING SNAPSHOT</span><h2>Look at you go, {user.name.split(" ")[0]} <span>✦</span></h2><p>You're building something brilliant. Keep going!</p><button className="banner-button" onClick={() => setPage("Solve")}>Pick up where you left off <span>↗</span></button></div><div className="banner-illustration"><div className="glow-ring" /><div className="banner-orbit">o</div><span className="float-star fs-one">✦</span><span className="float-star fs-two">✧</span><span className="float-card">+{Number(data.credits || 0)} credits</span></div><div className="banner-count"><span>YOUR CLASS</span><strong>0{user.className}{user.section}</strong><small>Sunrise Public School</small></div></div>
    <div className="stats-grid"><StatCard icon="✦" value={Number(data.credits || 0).toLocaleString()} label="Credits earned" note="Unlocked badges update here" tint="violet" /><StatCard icon="♨" value={`${data.streak} days`} label="Learning streak" note="Best: 12 days" tint="gold" /><StatCard icon="◒" value={`${data.mastery}%`} label="Concept mastery" note="+8% this month" tint="mint" /><StatCard icon="✓" value="2" label="Tasks due soon" note="One is due today" tint="blue" /></div>
    <ActiveCalendar tasks={data.tasks} />
    <div className="content-grid"><section className="surface subject-overview"><div className="section-title"><div><h3>Your subjects</h3><p>Steady progress across the board</p></div><button className="subtle-link" onClick={() => setPage("Subjects")}>All subjects <span>→</span></button></div><div className="subject-list">{data.subjects.map((subject) => <button className="subject-row" key={subject.name} onClick={() => { setSelectedSubject(subject.name); setPage("Subjects"); }}><span className={`subject-icon ${subject.color}`}>{subject.icon}</span><span className="subject-info"><strong>{subject.name}</strong><small>{subject.detail}</small></span><span className="subject-progress"><span className="progress-track"><i className={subject.color} style={{ width: `${subject.score}%` }} /></span><small>{subject.score}%</small></span><span className="row-arrow">↗</span></button>)}</div></section><section className="surface task-panel"><div className="section-title"><div><h3>Coming up</h3><p>A little at a time does it</p></div><button className="subtle-link" onClick={() => setPage("Assignments")}>See all <span>→</span></button></div><div className="task-list">{data.tasks.map((task, i) => <div className="task-row" key={task.title}><span className={`task-check ${task.done ? "checked" : ""}`}>{task.done ? "✓" : ""}</span><div className="task-info"><strong>{task.title}</strong><small>{task.subject} <span>·</span> {task.due}</small></div><span className={`task-type task-${i}`}>{task.kind}</span></div>)}</div></section></div>
    <div className="lower-grid"><section className="surface daily-card"><div className="daily-graphic"><span>✦</span><div className="mini-orbit">◎</div></div><div><span className="eyebrow">TODAY'S LITTLE CHALLENGE</span><h3>Can you crack the code?</h3><p>Try 5 quick algebra questions and earn a 20 point bonus.</p><button className="text-button" onClick={() => setPage("Solve")}>Take the challenge <span>→</span></button></div></section><section className="surface milestone-card"><div className="milestone-head"><div><h3>Your next milestone</h3><p>Level {data.level} · Bright Mind</p></div><span className="level-badge">L{data.level}</span></div><div className="milestone-track"><i style={{ width: "68%" }} /></div><div className="milestone-foot"><span>1,240 XP</span><span>1,800 XP</span></div><p className="milestone-caption">560 more points to Level 4 <span>✦</span></p></section></div>
  </>;
  if (page === "Subjects") return <><div className="subject-room-grid">{data.subjects.map((subject) => <section className={`surface room-card ${selectedSubject === subject.name ? "room-selected" : ""}`} key={subject.name}><div className="room-top"><button className="room-subject-select" onClick={() => { setSelectedSubject(subject.name); setActiveRoomTool(""); }}><span className={`subject-icon ${subject.color}`}>{subject.icon}</span><span>{subject.name}</span></button><span className="room-score">{subject.score}%</span></div><p>{subject.detail}</p><div className="room-tools">{["Teacher", "DPPs", "Videos", "Assignments", "Questions", "Chat", "Whiteboard", "Analysis"].map((tool, j) => <button key={tool} onClick={() => { setSelectedSubject(subject.name); setActiveRoomTool(tool); }}>{["◉", "⌁", "▷", "☷", "≡", "✉", "▤", "◒"][j]} {tool}</button>)}</div><span className="room-open">{selectedSubject === subject.name ? "Subject room" : "Choose room"} ↗</span></section>)}</div><section className="surface room-detail"><div><span className="eyebrow">{activeRoomTool ? `${selectedSubject.toUpperCase()} · ${activeRoomTool.toUpperCase()}` : "YOUR NEXT STEP"}</span><RoomToolPanel tool={activeRoomTool} subject={selectedSubject} setPage={setPage} notify={notify} /></div>{!activeRoomTool && <button className="primary-button" onClick={() => setPage("Learn")}>Continue learning ↗</button>}</section></>;
  if (page === "Learn") return <><div className="learn-hero surface"><div><span className="eyebrow">CONCEPT DNA · MATHEMATICS</span><h2>Algebra is just a<br />puzzle with a pattern.</h2><p>Let's connect the dots: from fractions you already know, to equations you're about to master.</p><button className="primary-button" onClick={() => notify("Lesson started — let's explore one step at a time.")}>Start a 6-min lesson <span>→</span></button></div><div className="dna-visual"><span className="dna-node node-a">⅓</span><span className="dna-node node-b">x + 2</span><span className="dna-node node-c">= 5</span><span className="dna-link link-a" /><span className="dna-link link-b" /><span className="dna-center">✦</span></div></div><div className="content-grid learn-cards"><section className="surface"><div className="section-title"><div><h3>Your concept pathway</h3><p>Every new skill builds on the last</p></div><span className="chip chip-mint">3 of 5 steps</span></div><div className="pathway">{["Fractions & number sense", "The language of algebra", "One-step equations", "Equations with brackets", "Word problems"].map((label, i) => <div className={`path-step ${i < 3 ? "step-done" : ""} ${i === 2 ? "current-step" : ""}`} key={label}><span>{i < 2 ? "✓" : `0${i + 1}`}</span><div><strong>{label}</strong><small>{i < 2 ? "You've got this" : i === 2 ? "Ready when you are · 6 min" : "Coming up next"}</small></div></div>)}</div></section><section className="surface tip-card"><span className="tip-icon">✦</span><span className="eyebrow">A TIP JUST FOR YOU</span><h3>Remember equivalent fractions?</h3><p>That same balance idea is what makes solving for <i>x</i> feel natural. We'll use it in today's lesson.</p><button className="subtle-link" onClick={() => notify("Tip saved to your learning journal.")}>Save this tip <span>→</span></button></section></div></>;
  if (page === "Solve") return <Practice data={data} notify={notify} onReward={onReward} />;
  if (page === "Test") return <TestPage notify={notify} onReward={onReward} />;
  if (page === "Dictionary") return <VocabularyDictionary user={user} data={data} />;
  if (page === "Handbooks") return <Handbooks notify={notify} />;
  if (page === "Word Discovery") return Number(user.className) >= 6 && Number(user.className) <= 8
    ? <DailyWordDiscovery user={user} notify={notify} onReward={onReward} />
    : <div className="surface feature-empty"><h2>Word Discovery is for Classes 6–8</h2><p>Explore your dictionary or choose a subject handbook to keep learning.</p></div>;
  if (page.startsWith("Teacher chat · ")) return <Messages user={user} notify={notify} subject={page.slice("Teacher chat · ".length)} />;
  if (page === "Assignments") return <Assignments data={data} notify={notify} />;
  if (page === "Messages") return <Messages user={user} notify={notify} />;
  if (page === "Rewards") return <Rewards data={data} notify={notify} />;
  return <div className="surface"><h3>Your learning is taking shape</h3><p>Keep showing up. Your progress will appear here.</p></div>;
}

function ActiveCalendar({ tasks }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7) + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_value, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const changeWeek = (delta) => {
    setWeekOffset((offset) => offset + delta);
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + delta * 7);
      return next;
    });
  };
  const tasksForDate = (date) => {
    const offset = Math.round((date - today) / 86400000);
    const dayLabel = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(/^0/, "");
    return tasks.filter((task) => {
      const due = task.due.toLowerCase();
      return (offset === 0 && due.includes("today")) || (offset === 1 && due.includes("tomorrow")) || task.due.includes(dayLabel);
    });
  };
  const dueTasks = tasksForDate(selectedDate);
  return <section className="surface active-calendar"><div className="calendar-heading"><div><span className="eyebrow">YOUR STUDY CALENDAR</span><h3>{weekStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h3></div><div className="calendar-controls"><button className="secondary-button" onClick={() => changeWeek(-1)} aria-label="Previous week">←</button><button className="secondary-button" onClick={() => changeWeek(1)} aria-label="Next week">→</button></div></div><div className="calendar-week">{days.map((date) => { const isToday = date.toDateString() === today.toDateString(); const isSelected = date.toDateString() === selectedDate.toDateString(); return <button className={`calendar-day ${isToday ? "calendar-today" : ""} ${isSelected ? "calendar-selected" : ""}`} key={date.toISOString()} onClick={() => setSelectedDate(date)} aria-label={date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} aria-pressed={isSelected}><small>{date.toLocaleDateString("en-IN", { weekday: "short" })}</small><strong>{date.getDate()}</strong><i className={tasksForDate(date).length ? "calendar-dot" : ""} /></button>; })}</div><div className="calendar-summary"><strong>{selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</strong><span>{dueTasks.length ? `${dueTasks.length} task${dueTasks.length === 1 ? "" : "s"} due` : "A little space to focus"}</span></div></section>;
}

function VocabularyDictionary({ user, data }) {
  const [query, setQuery] = useState("");
  const localWords = (() => {
    try { return JSON.parse(localStorage.getItem(`orbit-dictionary-${user.id}`) || "[]"); }
    catch (error) { console.error("Saved vocabulary could not be loaded.", error); return []; }
  })();
  const words = Array.from(new Map([...(data.dictionary || []), ...localWords].map((entry) => [entry.word.toLocaleLowerCase(), entry])).values())
    .sort((left, right) => left.word.localeCompare(right.word));
  const filtered = words.filter((entry) => `${entry.word} ${entry.meaning} ${entry.example}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <section className="surface dictionary-panel">
    <div className="section-title"><div><h2>Your vocabulary</h2><p>{words.length} words saved · searchable and sorted A–Z</p></div><span className="chip chip-violet">Aa</span></div>
    <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a word, meaning, or example…" aria-label="Search dictionary" /></label>
    <div className="vocabulary-list">{filtered.map((entry) => <article className="vocabulary-entry" key={entry.word}><span className="vocabulary-letter">{entry.word.charAt(0).toUpperCase()}</span><div><h3>{entry.word}</h3><p>{entry.meaning}</p><small>“{entry.example}”</small></div></article>)}{filtered.length === 0 && <p className="empty-search">No matching words yet. Try another search.</p>}</div>
  </section>;
}

const handbooks = {
  Mathematics: {
    notes: ["Keep both sides of an equation balanced when solving.", "To find a fraction of a number, multiply by the numerator and divide by the denominator.", "Area of a rectangle = length × breadth.", "The sum of angles in a triangle is 180°."],
    formulas: ["Perimeter of rectangle = 2(l + b)", "Area of triangle = ½ × base × height", "Speed = distance ÷ time", "Simple interest = (principal × rate × time) ÷ 100"]
  },
  Science: {
    notes: ["A force can change an object's motion, direction, or shape.", "Plants make food by photosynthesis using sunlight, water, and carbon dioxide.", "Matter commonly exists as solids, liquids, and gases.", "A habitat provides an organism with food, water, and shelter."],
    formulas: ["Speed = distance ÷ time", "Density = mass ÷ volume", "Work = force × distance", "Photosynthesis: carbon dioxide + water → glucose + oxygen"]
  },
  "Social Studies": {
    notes: ["The Constitution of India came into effect on 26 January 1950.", "Democracy gives citizens a voice in choosing their representatives.", "Maps use a scale to compare a distance on paper with a real distance.", "Climate describes long-term weather patterns in a region."],
    formulas: ["Map distance = ground distance ÷ map scale", "Population density = population ÷ area", "Timeline order: earliest → latest"]
  },
  English: {
    notes: ["A complete sentence has a subject and a predicate.", "Use a comma to separate items in a list.", "An adjective describes a noun; an adverb describes an action.", "Support a reading answer with evidence from the passage."],
    formulas: ["Subject + verb + object = a clear basic sentence", "Main idea + supporting details = a useful summary"]
  },
  Hindi: {
    notes: ["संज्ञा किसी व्यक्ति, स्थान, वस्तु या भाव का नाम है।", "सर्वनाम संज्ञा के स्थान पर प्रयोग होता है।", "वाक्य का अर्थ स्पष्ट रखने के लिए सही विराम-चिह्न लगाएँ।", "कहानी का सार लिखते समय मुख्य घटनाओं को क्रम से लिखें।"],
    formulas: ["संज्ञा + विशेषण = विशेषता बताने वाला वाक्यांश", "मुख्य विचार + सहायक विवरण = सारांश"]
  },
  "Computer Science": {
    notes: ["An algorithm is a clear sequence of steps to solve a problem.", "A variable stores a value that a program can use or update.", "Break a large problem into smaller, testable parts.", "Check edge cases when testing a program."],
    formulas: ["Input → Process → Output", "Binary place values: 1, 2, 4, 8, 16, 32"]
  }
};

function Handbooks({ notify }) {
  const [subject, setSubject] = useState("Mathematics");
  const handbook = handbooks[subject];
  const download = () => {
    const content = [`${subject} · Quick revision handbook`, "", "REVISION NOTES", ...handbook.notes.map((note) => `• ${note}`), "", "FORMULA / QUICK REFERENCE SHEET", ...handbook.formulas.map((formula) => `• ${formula}`)].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${subject.toLowerCase().replace(/\s+/g, "-")}-handbook.txt`;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    window.setTimeout(() => { link.remove(); URL.revokeObjectURL(url); }, 1000);
    notify(`${subject} handbook downloaded.`);
  };
  return <div className="handbook-layout"><section className="surface handbook-panel"><div className="section-title"><div><h2>Subject handbooks</h2><p>Quick revision notes and formula sheets for Classes 6–10</p></div><button className="primary-button" onClick={download}>Download guide ⇩</button></div><label className="handbook-select-label">Choose a subject<select value={subject} onChange={(event) => setSubject(event.target.value)}>{Object.keys(handbooks).map((name) => <option key={name}>{name}</option>)}</select></label><div className="handbook-content"><div><span className="eyebrow">QUICK REVISION</span><ul>{handbook.notes.map((note) => <li key={note}>{note}</li>)}</ul></div><div><span className="eyebrow">FORMULA SHEET</span><ul>{handbook.formulas.map((formula) => <li key={formula}>{formula}</li>)}</ul></div></div></section><aside className="surface handbook-aside"><span className="tip-icon">✦</span><h3>Make revision work for you</h3><p>Read a note, explain it in your own words, and try one practice problem before moving on.</p><span className="chip chip-mint">6 subject guides</span></aside></div>;
}

function DailyWordDiscovery({ user, notify, onReward }) {
  const date = new Date().toISOString().slice(0, 10);
  const submissionKey = `orbit-word-discovery-${user.id}-${date}`;
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [sentence, setSentence] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(() => {
    try { return JSON.parse(localStorage.getItem(submissionKey) || "null"); }
    catch (readError) { console.error("Today's word activity could not be restored.", readError); return null; }
  });
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { submission } = await api("/word-discovery", {
        method: "POST",
        body: JSON.stringify({
          word, meaning, sentence, className: user.className, section: user.section,
          studentId: user.id, studentName: user.name
        })
      });
      setResult(submission);
      localStorage.setItem(submissionKey, JSON.stringify(submission));
      if (submission.result === "unique") {
        const dictionaryKey = `orbit-dictionary-${user.id}`;
        const savedWords = JSON.parse(localStorage.getItem(dictionaryKey) || "[]");
        const entry = { word: submission.word, meaning: submission.meaning, example: submission.sentence };
        localStorage.setItem(dictionaryKey, JSON.stringify([...savedWords.filter((item) => item.word.toLowerCase() !== entry.word.toLowerCase()), entry]));
      }
      if (submission.credits > 0) onReward(submission.credits, `Word saved! +${submission.credits} credits ✦`);
      else notify("This matched a classmate's complete submission, so this activity earned 0 credits.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  };
  return <div className="word-discovery-layout"><section className="surface word-card"><span className="eyebrow">DAILY WORD DISCOVERY · CLASS {user.className}</span><h2>Find a word worth sharing.</h2><p>Choose a new word, explain it in your own words, and write an original sentence. One submission per day.</p>{result ? <div className={`word-result ${result.result === "duplicate" ? "word-duplicate" : ""}`}><span className="word-result-icon">{result.result === "duplicate" ? "↻" : "✦"}</span><div><h3>{result.result === "duplicate" ? "Let's make it your own next time" : "Word submitted!"}</h3><p>{result.result === "duplicate" ? "The word, meaning, and sentence matched another student's entry. No credits were awarded." : result.result === "unique" ? "A unique word! It's now saved in your dictionary." : "Your original example is saved for today."}</p><strong>{result.credits} credits earned</strong></div></div> : <form className="word-form" onSubmit={submit}><label>New word<input value={word} onChange={(event) => setWord(event.target.value)} placeholder="e.g. resilience" minLength={2} maxLength={60} required /></label><label>Meaning<textarea value={meaning} onChange={(event) => setMeaning(event.target.value)} placeholder="Explain what the word means in your own words…" minLength={8} maxLength={300} required /></label><label>Your original example sentence<textarea value={sentence} onChange={(event) => setSentence(event.target.value)} placeholder="Use the word in a sentence you created…" minLength={8} maxLength={300} required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? "Checking your entry…" : "Submit today's word ↗"}</button></form>}</section><aside className="surface word-rules"><span className="tip-icon">Aa</span><h3>Fair, thoughtful, and yours</h3><p>Submit one entry a day. Matching a classmate's word, meaning, and sentence earns no credits. A new word earns a 25-credit bonus; another original entry earns 10 credits.</p><div className="credit-rule"><span>Original new word</span><strong>+25</strong></div><div className="credit-rule"><span>Original entry</span><strong>+10</strong></div><div className="credit-rule"><span>Exact class match</span><strong>0</strong></div></aside></div>;
}

function RoomToolPanel({ tool, subject, setPage, notify }) {
  const [playing, setPlaying] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const questions = ["What is one example of this idea in everyday life?", "Which key term best describes today's concept?", "How would you explain this chapter to a friend?"];
  if (!tool) return <><h3>{subject}: a new idea is waiting</h3><p>Pick up with a short lesson on the concept you're working on. Take it at your own pace.</p></>;
  if (tool === "Teacher") return <><h3>Meet your {subject} teacher</h3><p>Ms. Ananya Iyer · Mathematics · Available Mon–Fri, 9:00 AM–3:30 PM</p><button className="secondary-button room-action" onClick={() => setPage("Messages")}>Message your teacher ↗</button></>;
  if (tool === "DPPs") return <><h3>Your adaptive daily practice</h3><p>Three quick questions tuned to your current chapter. Save your set offline or jump into a practice session.</p><button className="primary-button room-action" onClick={() => setPage("Solve")}>Start today's DPP ↗</button><button className="secondary-button room-action" onClick={() => { localStorage.setItem("orbit-dpp-cache", JSON.stringify(questions)); notify("Today's practice is saved for offline study."); }}>⇩ Save offline</button></>;
  if (tool === "Videos") return <><h3>Video lesson · {subject}</h3><p>Linear equations: finding the balance · 6 minutes</p><div className={`lecture-player ${playing ? "lecture-playing" : ""}`}><div className="lecture-equation">2x + 4 = 14</div><button className="lecture-play" onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ" : "▶"}</button><span>{playing ? "Lesson playing · Step 1: isolate x" : "Tap play to begin your lesson"}</span><div className="lecture-progress"><i style={{ width: playing ? "38%" : "0%" }} /></div></div></>;
  if (tool === "Assignments") return <><h3>Submit your activity</h3><p>Share your work for the current {subject} activity. Your teacher can add feedback in class.</p>{submitted ? <div className="submit-success">✓ &nbsp; Work submitted — nicely done!</div> : <form className="room-submit-form" onSubmit={async (event) => { event.preventDefault(); try { await api("/submissions", { method: "POST", body: JSON.stringify({ subject, answer }) }); setSubmitted(true); } catch (err) { notify(err.message); } }}><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write a short note about your work…" required /><button className="primary-button">Submit activity ↗</button></form>}</>;
  if (tool === "Questions") return <><h3>Important questions · {subject}</h3><p>Chapter 4 · Linear equations</p><div className="important-question"><strong>01</strong><span>{questions[0]}</span><button onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? "Hide" : "Think it through"} ↗</button>{showAnswer && <p>Look for a familiar situation where two sides need to stay equal, like balancing a scale.</p>}</div><div className="important-question"><strong>02</strong><span>How can you check whether your solution is correct?</span><button onClick={() => notify("Tip: substitute your answer back into the original equation.")}>Show a tip ↗</button></div></>;
  if (tool === "Chat") return <><h3>A quick question for your teacher?</h3><p>Start a private conversation about {subject}. Your teacher will see your message in their classroom inbox.</p><button className="primary-button room-action" onClick={() => setPage("Messages")}>Open teacher chat ↗</button></>;
  if (tool === "Whiteboard") return <Whiteboard subject={subject} />;
  return <><h3>Your {subject} report</h3><p>Concept mastery is growing steadily. Here's how the current chapter is taking shape.</p><div className="room-analysis"><span>Fractions & number sense</span><i><b style={{ width: "88%" }} /></i><strong>88%</strong><span>Linear equations</span><i><b style={{ width: "72%" }} /></i><strong>72%</strong><span>Word problems</span><i><b style={{ width: "61%" }} /></i><strong>61%</strong></div></>;
}

function Whiteboard({ subject }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  useEffect(() => {
    const saved = localStorage.getItem(`orbit-whiteboard-${subject}`);
    const canvas = canvasRef.current;
    if (!saved || !canvas) return;
    const image = new Image();
    image.onload = () => canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = saved;
  }, [subject]);
  const point = (event) => {
    const bounds = canvasRef.current.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * canvasRef.current.width / bounds.width, y: (event.clientY - bounds.top) * canvasRef.current.height / bounds.height };
  };
  const start = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const pos = point(event);
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(pos.x, pos.y);
    context.strokeStyle = "#d9caff";
    context.lineWidth = 3;
    context.lineCap = "round";
  };
  const draw = (event) => {
    if (!drawing.current) return;
    const pos = point(event);
    const context = canvasRef.current.getContext("2d");
    context.lineTo(pos.x, pos.y);
    context.stroke();
  };
  const finish = () => {
    if (!drawing.current) return;
    drawing.current = false;
    localStorage.setItem(`orbit-whiteboard-${subject}`, canvasRef.current.toDataURL());
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem(`orbit-whiteboard-${subject}`);
  };
  return <><div className="whiteboard-heading"><div><h3>{subject} whiteboard</h3><p>Sketch out a solution — your work saves on this device.</p></div><button className="secondary-button" onClick={clear}>Clear board</button></div><canvas ref={canvasRef} className="whiteboard-canvas" width="900" height="260" onPointerDown={start} onPointerMove={draw} onPointerUp={finish} onPointerCancel={finish} aria-label="Interactive digital whiteboard" /></>;
}

function Practice({ data, notify, onReward }) {
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState(0);
  const [points, setPoints] = useState(0);
  const questionSets = [
    [
      { q: "If 3x = 18, what is x?", answer: "6", hints: ["A multiple of 3 equals 18.", "Divide both sides by 3."] },
      { q: "Solve: x + 7 = 15", answer: "8", hints: ["Undo the addition to isolate x.", "Subtract 7 from both sides."] },
      { q: "If 2x = 14, what is x?", answer: "7", hints: ["Think of the number multiplied by 2.", "Divide both sides by 2."] }
    ],
    [
      { q: "Solve: 4x + 2 = 18", answer: "4", hints: ["Undo the addition before multiplication.", "Subtract 2, then divide by 4."] },
      { q: "Solve: 3x - 6 = 15", answer: "7", hints: ["Undo the subtraction first.", "Add 6, then divide by 3."] },
      { q: "Solve: x ÷ 5 + 2 = 6", answer: "20", hints: ["Undo the addition first.", "Subtract 2, then multiply by 5."] }
    ],
    [
      { q: "Solve: 2(x + 3) = 18", answer: "6", hints: ["Undo the multiplication outside the brackets.", "Divide by 2, then subtract 3."] },
      { q: "Solve: 3(x - 2) + 4 = 19", answer: "7", hints: ["Isolate the bracketed expression first.", "Subtract 4, divide by 3, then add 2."] },
      { q: "Solve: (x + 4) ÷ 3 = 6", answer: "14", hints: ["Undo the division before the addition.", "Multiply by 3, then subtract 4."] }
    ]
  ];
  const difficulty = Math.min(2, Math.floor(points / 30));
  const questions = questionSets[difficulty];
  const current = questions[question % questions.length];
  const check = () => {
    if (!answer.trim()) return;
    if (answer.trim() === current.answer) {
      const gained = 15 + (question + 1) * 5;
      setPoints((currentPoints) => currentPoints + gained);
      onReward?.(gained, `Nice work! +${gained} credits earned ✦`);
      notify(`That's right! +${gained} credits ✦`);
      setQuestion((currentIndex) => currentIndex + 1);
      setAnswer("");
      setHint(0);
    } else {
      setHint((currentHint) => Math.min(2, currentHint + 1));
      notify("Not quite — try a hint and have another go.");
    }
  };
  return <div className="practice-layout"><section className="surface practice-card"><div className="practice-meta"><span className="chip chip-violet">DAILY PRACTICE · ADAPTIVE</span><span>Question {question % 3 + 1} of 3</span></div><div className="practice-progress"><i style={{ width: `${((question % 3) / 3) * 100}%` }} /></div><span className="eyebrow">MATHEMATICS · {["FOUNDATION", "ON-TRACK", "CHALLENGE"][difficulty]}</span><h2>{current.q}</h2><p>Take a breath, work it through, and type your answer below.</p>{hint > 0 && <div className="hint-box"><span>✦ STEP {hint} HINT</span><p>{current.hints[hint - 1]}</p></div>}<label className="answer-label" htmlFor="answer">Your answer</label><div className="answer-row"><input id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="Type a number…" /><button className="primary-button" onClick={check}>Check answer <span>→</span></button></div><button className="text-button hint-button" onClick={() => setHint((currentHint) => Math.min(2, currentHint + 1))}>Need a hint? <span>✦</span></button></section><aside className="surface practice-aside"><div className="aside-icon">✦</div><span className="eyebrow">YOU'RE DOING GREAT</span><h3>Every try teaches you something.</h3><p>Correct answers gradually unlock harder questions; step-by-step hints are always available.</p><div className="aside-score"><span>Earned this session</span><strong>+{points} <small>credits</small></strong></div><button className="offline-button" onClick={() => { localStorage.setItem("orbit-dpp-cache", JSON.stringify(questionSets)); notify("Practice sets saved for offline study."); }}>⇩ Save DPP for offline</button><small className="offline-caption">Low data? Your practice set is ready offline.</small></aside></div>;
}

function TestPage({ notify, onReward }) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [choice, setChoice] = useState("");
  const [remaining, setRemaining] = useState(600);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultScore, setResultScore] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const questions = [
    { prompt: "Which value makes 2x + 4 = 14 true?", options: ["x = 4", "x = 5", "x = 7", "x = 9"], correct: "x = 5" },
    { prompt: "Solve: x + 7 = 15.", options: ["x = 7", "x = 8", "x = 9", "x = 22"], correct: "x = 8" },
    { prompt: "If 3x = 18, what is x?", options: ["x = 3", "x = 6", "x = 15", "x = 21"], correct: "x = 6" },
    { prompt: "Solve: 5x = 35.", options: ["x = 5", "x = 6", "x = 7", "x = 30"], correct: "x = 7" },
    { prompt: "Which operation undoes subtraction of 4?", options: ["Add 4", "Subtract 4", "Multiply by 4", "Divide by 4"], correct: "Add 4" },
    { prompt: "Solve: 2x = 16.", options: ["x = 6", "x = 8", "x = 14", "x = 32"], correct: "x = 8" },
    { prompt: "If x - 9 = 3, what is x?", options: ["x = -6", "x = 6", "x = 12", "x = 27"], correct: "x = 12" },
    { prompt: "Which equation has the solution x = 4?", options: ["x + 3 = 8", "2x = 8", "x - 2 = 1", "3x = 9"], correct: "2x = 8" }
  ];
  useEffect(() => {
    if (!started || done) return undefined;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [started, done]);
  useEffect(() => {
    if (remaining === 0 && started) {
      const score = answers.filter((answer) => answer.correct).length;
      setResultScore(score);
      const earned = score * 5 + 10;
      onReward?.(earned, `Time is up · ${score}/8 correct · +${earned} credits`);
      setDone(true);
    }
  }, [remaining, started, answers]);
  useEffect(() => {
    if (!started || done) return undefined;
    const lockTab = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches((count) => count + 1);
        notify("Tab switch detected. Please stay on this tab during your check-in.");
      }
    };
    document.addEventListener("visibilitychange", lockTab);
    return () => document.removeEventListener("visibilitychange", lockTab);
  }, [started, done, notify]);
  if (!started) return <div className="surface test-intro"><div className="test-icon">◷</div><span className="eyebrow">YOUR WEEKLY CHECK-IN</span><h2>Ready to see how far you've come?</h2><p>A short, friendly check-in on linear equations. No pressure — this helps us find the next best lesson for you.</p><div className="test-facts"><span>◷ &nbsp; 10 minutes</span><span>≡ &nbsp; 8 questions</span><span>✦ &nbsp; Just for you</span></div><button className="primary-button" onClick={() => setStarted(true)}>Begin check-in <span>→</span></button><small>Keep this tab open while you take your check-in.</small></div>;
  if (done) {
    const feedback = resultScore >= 6
      ? "Strong work on equations. Your next lesson can stretch into multi-step problems."
      : "A little more practice with inverse operations will help. Your Learn pathway is ready to revisit.";
    return <div className="surface test-intro"><div className="test-icon test-done">✓</div><span className="eyebrow">CHECK-IN COMPLETE</span><h2>That's a wrap. Nice work!</h2><p>You answered {resultScore} of 8 correctly. {feedback}</p><p className="test-integrity-note">Tab switches detected: {tabSwitches} · Your results are saved for this session.</p><button className="primary-button" onClick={() => { setDone(false); setStarted(false); setRemaining(600); setQuestionIndex(0); setAnswers([]); setChoice(""); setResultScore(0); setTabSwitches(0); }}>Back to your space <span>→</span></button></div>;
  }
  const question = questions[questionIndex];
  return <div className="surface test-question"><div className="practice-meta"><span className="chip chip-violet">WEEKLY CHECK-IN · INVIGILATED</span><span className="test-clock">◷ {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</span></div><div className="practice-progress"><i style={{ width: `${(questionIndex / questions.length) * 100}%` }} /></div><span className="eyebrow">QUESTION {questionIndex + 1} OF {questions.length} · LINEAR EQUATIONS</span><h2>{question.prompt}</h2><div className="choice-list">{question.options.map((option) => <button key={option} className={`choice-button ${choice === option ? "selected-choice" : ""}`} onClick={() => setChoice(option)}><span>{option}</span><span>{choice === option ? "✓" : "○"}</span></button>)}</div><button className="primary-button" onClick={() => {
    if (!choice) { notify("Choose an answer before continuing."); return; }
    const nextAnswers = [...answers, { correct: choice === question.correct }];
    setAnswers(nextAnswers);
    setChoice("");
    if (questionIndex + 1 === questions.length) {
      const score = nextAnswers.filter((answer) => answer.correct).length;
      setResultScore(score);
      const earned = score * 5 + 10;
      onReward?.(earned, `Check-in complete! ${score}/8 correct · +${earned} credits ✦`);
      setDone(true);
    } else {
      setQuestionIndex((index) => index + 1);
    }
  }}>{questionIndex + 1 === questions.length ? "Finish check-in" : "Next question"} <span>→</span></button></div>;
}

function Assignments({ data, notify }) {
  const [done, setDone] = useState({});
  return <><div className="stats-grid assignment-stats"><StatCard icon="☷" value="3" label="All assignments" note="Across 3 subjects" tint="violet" /><StatCard icon="◷" value="2" label="Coming up" note="One due today" tint="gold" /><StatCard icon="✓" value="1" label="Completed" note="Great start!" tint="mint" /></div><section className="surface assignments-panel"><div className="section-title"><div><h3>Your to-do list</h3><p>Every tick is a little win</p></div><span className="chip chip-mint">This week</span></div>{data.tasks.map((task, i) => <div className="assignment-row" key={task.title}><button className={`task-check ${task.done || done[i] ? "checked" : ""}`} onClick={() => { setDone({ ...done, [i]: !done[i] }); if (!task.done) notify("A task ticked off — nicely done!"); }}>{task.done || done[i] ? "✓" : ""}</button><div className="assignment-main"><strong>{task.title}</strong><small>{task.subject} · {task.due}</small></div><span className={`task-type task-${i}`}>{task.kind}</span><button className="secondary-button" onClick={() => notify(`${task.title} opened — work saved as you go.`)}>{task.done || done[i] ? "View work" : "Start now"} ↗</button></div>)}</section></>;
}

function Messages({ user, notify, subject = "Mathematics" }) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState([]);
  const send = async () => {
    if (!value.trim()) return;
    try { await api("/messages", { method: "POST", body: JSON.stringify({ message: value, user: user.name }) }); setSent([...sent, value]); setValue(""); }
    catch (err) { notify(err.message); }
  };
  const teacherBySubject = { Mathematics: "Ms. Ananya Iyer", Science: "Mr. Rohan Menon", English: "Ms. Priya Nair", "Social Studies": "Mr. Arjun Rao" };
  const teacherName = teacherBySubject[subject] || "Your class teacher";
  return <div className="message-layout"><section className="surface chat-panel"><div className="chat-person"><span className="avatar teacher-avatar">✦</span><div><strong>{teacherName}</strong><small><span className="online-dot" /> Your {subject} teacher</small></div><button className="icon-button" onClick={() => notify("This is a private conversation with your teacher.")}>···</button></div><div className="chat-date">YOUR {subject.toUpperCase()} CLASS · PRIVATE CHAT</div><div className="chat-bubble received">Hello {user.name?.split(" ")[0] || "there"}! Send me a note about what you'd like help with in {subject}.<small>Teacher · Today</small></div>{sent.map((message, i) => <div className="chat-bubble sent-bubble" key={`${message}-${i}`}>{message}<small>Just now</small></div>)}<div className="chat-input"><input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Write a message…" /><button className="primary-button" onClick={send}>Send ↗</button></div></section><aside className="surface chat-help"><span className="tip-icon">✦</span><h3>Need help with something?</h3><p>Ask a question, share a win, or let your teacher know where you're stuck.</p><button className="subtle-link" onClick={() => notify("Your teacher will be happy to help.")}>How messaging works →</button></aside></div>;
}

function Rewards({ data, notify }) {
  const allBadges = ["Math Wizard", "Streak Master", "Curious Mind", "Kind Helper", "Science Explorer", "Perfect Week"];
  const earnedBadges = Array.from(new Set([...(data.badges || []), ...getUnlockedBadges(Number(data.credits || 0))]));
  return <><div className="rewards-hero surface"><div><span className="eyebrow">YOUR LITTLE WINS, ALL IN ONE PLACE</span><h2>Look how far<br />you've come.</h2><p>Every practice, every brave try, every kind moment adds up.</p><button className="primary-button" onClick={() => notify("Your sticker collection is ready to show your teacher!")}>Show my stickers <span>↗</span></button></div><div className="reward-medal">✦<small>LEVEL {data.level}</small></div></div><section className="surface badge-shelf"><div className="section-title"><div><h3>Your sticker vault</h3><p>Collect them, keep them, be proud of them</p></div><span className="chip chip-violet">{earnedBadges.length} earned</span></div><div className="badge-grid">{allBadges.map((badge, i) => <button key={badge} className={`badge-item ${!earnedBadges.includes(badge) ? "badge-locked" : ""}`} onClick={() => notify(earnedBadges.includes(badge) ? `${badge} — earned and all yours!` : "Keep learning to unlock this sticker!")}><span className={`badge-art badge-${i % 5}`}>{["✳", "♨", "∑", "✦", "◈", "◎"][i % 6]}</span><strong>{badge}</strong><small>{earnedBadges.includes(badge) ? "EARNED · OCT 2026" : "KEEP GOING TO UNLOCK"}</small></button>)}</div></section><Milestone data={data} /></>;
}

function ParentPage({ page, data, user, notify }) {
  const childName = user.child || "Aarav Sharma";
  const childScore = data.subjects.reduce((total, item) => total + item.score, 0) / data.subjects.length;
  const usage = (() => {
    try { return JSON.parse(localStorage.getItem("orbit-usage-STU-2026-014") || "null"); }
    catch (error) { console.error("Student app attendance could not be loaded.", error); return null; }
  })();
  const trackedMinutes = Number(usage?.activeMinutes);
  const loginStreak = usage?.days?.length ? getLoginStreak(usage.days) : data.appStreak;
  const downloadReportCard = () => {
    const report = [
      `Orbit academic report card · ${childName}`,
      `Class 8A · Academic tier: ${getAcademicTier(childScore)}`,
      `Overall mastery: ${Math.round(childScore)}%`,
      "",
      ...data.subjects.map((item) => `${item.name}: ${item.score}%`),
      "",
      `School attendance: ${data.attendance}%`,
      `Assignments completed: 12 / 15`
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${childName.toLowerCase().replace(/\s+/g, "-")}-academic-report.txt`;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    window.setTimeout(() => { link.remove(); URL.revokeObjectURL(url); }, 1000);
    notify("Academic report card downloaded.");
  };
  if (page === "Attendance") return <>
    <div className="stats-grid"><StatCard icon="✓" value={`${data.attendance}%`} label="School attendance" note="Teacher-marked attendance" tint="mint" /><StatCard icon="✦" value={`${loginStreak} days`} label="App login streak" note="Daily active learning" tint="gold" /><StatCard icon="◷" value={usage ? `${Math.floor(trackedMinutes / 60)}h ${trackedMinutes % 60}m` : `${data.learningHours} hrs`} label="App learning time" note={usage ? "Tracked on this device" : "This week · sample record"} tint="violet" /></div>
    <div className="content-grid attendance-grids"><section className="surface"><div className="section-title"><div><h3>School attendance</h3><p>Marked by the class teacher</p></div><span className="chip chip-mint">Physical school</span></div><AttendanceLog entries={data.attendanceLog} /></section><section className="surface"><div className="section-title"><div><h3>App usage attendance</h3><p>Student logins and learning activity</p></div><span className="chip chip-violet">Orbit learning</span></div>{usage?.days?.length ? <div className="attendance-panel">{usage.days.slice(0, 7).map((day) => <div className="attendance-row" key={day}><span className="attendance-date-icon">✦</span><strong>{new Date(`${day}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</strong><span className="attendance-status present-status">{`Active · ${usage.minutesByDay?.[day] || 0} min`}</span></div>)}</div> : <AttendanceLog entries={data.appAttendanceLog} />}</section></div>
  </>;
  if (page === "My child") return <>
    <div className="parent-banner surface"><div className="avatar child-avatar">AS</div><div><span className="eyebrow">YOUR CHILD'S LEARNING SPACE</span><h2>{childName} <span className="chip chip-mint">Class 8A</span> <AcademicTier score={childScore} /></h2><p>Learning snapshot · Term 1 progress</p></div><button className="secondary-button" onClick={downloadReportCard}>Download report card ⇩</button></div>
    <div className="stats-grid"><StatCard icon="◒" value={`${Math.round(childScore)}%`} label="Overall mastery" note="Up 6% this month" tint="violet" /><StatCard icon="✦" value={`${loginStreak} days`} label="Learning streak" note="Best: 12 days" tint="gold" /><StatCard icon="☷" value="12 / 15" label="Assignments done" note="This month" tint="mint" /><StatCard icon="◷" value={`${data.testAverage}%`} label="Latest test score" note="Mathematics · 24 Oct" tint="blue" /><StatCard icon="⌁" value={`${data.dppCompletion}%`} label="DPP completion" note="This month" tint="violet" /></div>
    <div className="content-grid"><ParentProgress data={data} /><section className="surface"><div className="section-title"><div><h3>Recent progress updates</h3><p>Simple notes that matter most</p></div></div><div className="attendance-panel"><div className="attendance-row"><span className="attendance-date-icon">✓</span><strong>Math</strong><span className="attendance-status present-status">Strong in algebra</span></div><div className="attendance-row"><span className="attendance-date-icon">✓</span><strong>Science</strong><span className="attendance-status present-status">Needs a little more revision in force</span></div><div className="attendance-row"><span className="attendance-date-icon">✓</span><strong>English</strong><span className="attendance-status present-status">Reading confidence is improving</span></div></div></section></div>
    <section className="surface parent-history"><div className="section-title"><div><h3>Teacher communication history</h3><p>Recent classroom notes for your family</p></div></div>{data.messages.map((message, index) => <div className="history-entry" key={`${message}-${index}`}><span className="attendance-date-icon">✉</span><div><strong>{index === 0 ? "Ananya Iyer · Mathematics" : "Class teacher · Science"}</strong><p>{message}</p><small>{index === 0 ? "Today · 10:14 AM" : "Yesterday · 3:45 PM"}</small></div></div>)}</section>
  </>;
  if (page === "Progress") return <><div className="stats-grid"><StatCard icon="◒" value={`${Math.round(childScore)}%`} label="Overall mastery" note="Up 6% this month" tint="violet" /><StatCard icon="✦" value={`${loginStreak} days`} label="Learning streak" note="Best: 12 days" tint="gold" /><StatCard icon="✓" value={`${data.testAverage}%`} label="Test average" note="Across recent tests" tint="mint" /><StatCard icon="⌁" value={`${data.dppCompletion}%`} label="DPP completion" note="This month" tint="blue" /><StatCard icon="◷" value={usage ? `${Math.floor(trackedMinutes / 60)}h ${trackedMinutes % 60}m` : `${data.learningHours} hrs`} label="Learning time" note="This week" tint="blue" /></div><div className="content-grid"><ParentProgress data={data} /><section className="surface"><div className="section-title"><div><h3>Learning rhythm</h3><p>Minutes spent learning each day</p></div></div><div className="bar-chart">{[32, 54, 41, 79, 58, 93, 66].map((h, i) => <div key={i}><span style={{ height: `${h}%` }} /><small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small></div>)}</div><p className="chart-caption">A steady rhythm beats a perfect score.</p></section></div></>;
  return <Messages user={user} notify={notify} />;
}

function AttendanceLog({ entries }) {
  return <div className="attendance-panel">{entries.map((entry) => <div className="attendance-row" key={entry.date}><span className="attendance-date-icon">{entry.status === "Absent" || entry.status === "No activity" ? "–" : "✓"}</span><strong>{entry.date}</strong><span className={`attendance-status ${entry.status === "Absent" || entry.status === "No activity" ? "absent-status" : "present-status"}`}>{entry.status}</span></div>)}</div>;
}

function TeacherPage({ page, data, notify }) {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [posted, setPosted] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [savingAttendance, setSavingAttendance] = useState({});
  const markAttendance = async (learner, status) => {
    if (status === "Unmarked") return;
    setSavingAttendance((current) => ({ ...current, [learner.name]: true }));
    try {
      await api("/attendance", { method: "POST", body: JSON.stringify({ student: learner.name, date: new Date().toISOString().slice(0, 10), status }) });
      setAttendance((current) => ({ ...current, [learner.name]: status }));
      notify(`${learner.name} marked ${status.toLowerCase()}.`);
    } catch (attendanceError) {
      notify(attendanceError.message);
    } finally {
      setSavingAttendance((current) => ({ ...current, [learner.name]: false }));
    }
  };
  const scoreGroups = [
    { name: "Advanced", color: "violet", count: data.roster.filter((learner) => learner.score >= 85).length },
    { name: "On-Track", color: "mint", count: data.roster.filter((learner) => learner.score >= 70 && learner.score < 85).length },
    { name: "Remedial", color: "gold", count: data.roster.filter((learner) => learner.score < 70).length }
  ];
  if (page === "Roster") return <>
    <div className="section-title roster-heading"><div><span className="eyebrow">CLASS 8 · SECTION A</span><h2>Student roster</h2><p>Academic tiers update from recent classroom performance.</p></div><span className="chip chip-violet">{data.roster.length} learners</span></div>
    <section className="surface roster-panel"><div className="roster-table roster-table-head"><span>Student</span><span>Mastery</span><span>Credits</span><span>Academic tier</span><span>School attendance</span></div>{data.roster.map((learner) => <div className="roster-table" key={learner.name}><span className="roster-student"><span className="avatar small-avatar">{initials(learner.name)}</span><strong>{learner.name}</strong></span><span><i className="roster-meter"><b style={{ width: `${learner.score}%` }} /></i>{learner.score}%</span><span>{learner.credits.toLocaleString()}</span><AcademicTier score={learner.score} /><select className="attendance-select" aria-label={`Mark ${learner.name} attendance`} value={attendance[learner.name] || "Unmarked"} disabled={Boolean(savingAttendance[learner.name])} onChange={(event) => markAttendance(learner, event.target.value)}><option>Unmarked</option><option>Present</option><option>Absent</option></select></div>)}</section>
  </>;
  if (page === "Verification") return <section className="surface verification-panel"><div className="section-title"><div><h2>Milestone verification</h2><p>Review student-earned badges and recognize their effort.</p></div><span className="chip chip-mint">Teacher review</span></div><BadgeVerificationList items={["Aarav Sharma · Math Wizard", "Diya Patel · Streak Master", "Kabir Rao · Curious Mind"]} notify={notify} /></section>;
  if (page === "Classroom") return <><div className="teacher-banner surface"><div><span className="eyebrow">WEDNESDAY · CLASS 8A</span><h2>Good morning, Ananya <span>✦</span></h2><p>Your classroom is making steady progress. Here's the pulse for this week.</p></div><div className="teacher-banner-icon">▦</div></div><div className="stats-grid"><StatCard icon="♙" value={data.students} label="My students" note="Class 8 · Section A" tint="violet" /><StatCard icon="☷" value={data.submissions} label="To review" note="Across 3 assignments" tint="gold" /><StatCard icon="◒" value={`${data.classMastery}%`} label="Class mastery" note="+4% this month" tint="mint" /><StatCard icon="✉" value={data.attention} label="Need a nudge" note="Students to check in with" tint="blue" /></div><div className="content-grid teacher-content"><section className="surface"><div className="section-title"><div><h3>Class pulse</h3><p>Auto-grouped by recent mastery scores</p></div><button className="subtle-link" onClick={() => notify("Groups are recalculated from each student's latest mastery score.")}>How it works ↗</button></div>{scoreGroups.map((group) => <div className="group-row" key={group.name}><span className={`group-dot ${group.color}`} /><strong>{group.name}</strong><span className="group-progress"><i className={group.color} style={{ width: `${group.count / data.roster.length * 100}%` }} /></span><b>{group.count}</b><small>students</small></div>)}</section><section className="surface"><div className="section-title"><div><h3>Concept gaps · mastery heatmap</h3><p>Low-scoring concepts need another look</p></div><span className="chip chip-gold">2 to revisit</span></div>{data.concepts.map((item) => <div className="concept-row" data-mastery={item.score >= 80 ? "high" : item.score >= 70 ? "mid" : "low"} key={item.name}><span>{item.name}</span><span className="concept-meter"><i style={{ width: `${item.score}%` }} /></span><b>{item.score}%</b></div>)}</section></div><div className="content-grid"><AssignmentComposer title={assignmentTitle} setTitle={setAssignmentTitle} subject={subject} setSubject={setSubject} posted={posted} setPosted={setPosted} notify={notify} /><section className="surface"><div className="section-title"><div><h3>Recent submissions</h3><p>Ready for a quick look</p></div><button className="subtle-link" onClick={() => notify("Opening all submissions.")}>View all →</button></div>{data.submissionsList.slice(0, 3).map((submission) => <div className="submission-row" key={submission.student}><span className="avatar small-avatar">{initials(submission.student)}</span><div><strong>{submission.student}</strong><small>{submission.task}</small></div><button className="secondary-button" onClick={() => notify(`${submission.student}'s work opened for review.`)}>Review</button></div>)}</section></div></>;
  if (page === "Teacher inbox") return <><div className="stats-grid"><StatCard icon="✉" value="2" label="New messages" note="From students & parents" tint="violet" /><StatCard icon="♙" value="1" label="Student question" note="Needs a reply" tint="gold" /><StatCard icon="⌂" value="1" label="Parent update" note="All caught up" tint="mint" /></div><section className="surface inbox-panel"><div className="section-title"><div><h3>Your inbox</h3><p>Conversations from your classroom</p></div><span className="chip chip-violet">2 unread</span></div>{data.inbox.map((item) => <div className="inbox-row" key={item.from}><span className="avatar small-avatar">{initials(item.from)}</span><div className="inbox-main"><div><strong>{item.from}</strong><small>{item.role} · {item.time}</small></div><p>{item.text}</p></div><button className="secondary-button" onClick={() => notify(`Replying to ${item.from}.`)}>Reply ↗</button></div>)}</section><Messages user={{ name: "Ananya Iyer" }} notify={notify} /></>;
  if (page === "Review work") return <><div className="stats-grid"><StatCard icon="☷" value={data.submissions} label="To review" note="Across this week's work" tint="gold" /><StatCard icon="✓" value="14" label="Reviewed this week" note="Lovely feedback all round" tint="mint" /></div><section className="surface inbox-panel"><div className="section-title"><div><h3>Needs your eyes</h3><p>Quick feedback can make a big difference</p></div></div>{data.submissionsList.map((submission) => <div className="inbox-row" key={submission.student}><span className="avatar small-avatar">{initials(submission.student)}</span><div className="inbox-main"><div><strong>{submission.student}</strong><small>{submission.task} · {submission.status}</small></div><p>Submitted today · Add a score and a note to help them take their next step.</p></div><button className="primary-button" onClick={() => setSelectedSubmission(submission)}>Grade work ↗</button></div>)}</section><section className="surface verification-panel"><div className="section-title"><div><h3>Sticker showcase</h3><p>Celebrate the effort behind every achievement</p></div></div><BadgeVerificationList items={["Aarav Sharma · Math Wizard", "Diya Patel · Streak Master", "Kabir Rao · Curious Mind"]} notify={notify} /></section>{selectedSubmission && <GradingModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} notify={notify} />}</>;
  return <div className="surface"><h3>Class progress</h3><p>Concept mastery across Class 8A</p><TeacherConcepts data={data} /></div>;
}

function AssignmentComposer({ title, setTitle, subject, setSubject, posted, setPosted, notify }) {
  const [type, setType] = useState("Assignment");
  const [content, setContent] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    try {
      const { post } = await api("/classroom-posts", { method: "POST", body: JSON.stringify({ type, title, subject, content }) });
      setPosted([post, ...posted]);
      setTitle("");
      setContent("");
      notify(`${type} shared with Class 8A.`);
    }
    catch (err) { notify(err.message); }
  };
  return <section className="surface composer"><div className="section-title"><div><h3>Share something with class</h3><p>Post an assignment, class note, or handbook resource</p></div><span className="composer-icon">＋</span></div><form onSubmit={submit}><label htmlFor="post-type">Share as</label><select id="post-type" value={type} onChange={(event) => setType(event.target.value)}><option>Assignment</option><option>Class note</option><option>Handbook</option></select><label htmlFor="subject">Subject</label><select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}><option>Mathematics</option><option>Science</option><option>English</option><option>Social Studies</option><option>Hindi</option><option>Computer Science</option></select><label htmlFor="assignment-title">Title</label><input id="assignment-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === "Handbook" ? "e.g. Chapter 4 revision guide" : type === "Class note" ? "e.g. Notes from today's lesson" : "e.g. Practice: linear equations"} required /><label htmlFor="post-content">Details or resource link</label><textarea id="post-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add instructions, a short note, or a link…" maxLength={1000} /><button className="primary-button">Share with class ↗</button></form>{posted.map((item, i) => <div className="posted-item" key={`${item.title}-${i}`}><span>✓</span><div><strong>{item.title}</strong><small>{item.type} · {item.subject} · Posted just now</small></div></div>)}</section>;
}

function BadgeVerificationList({ items, notify }) {
  const [verified, setVerified] = useState(() => {
    try { return JSON.parse(localStorage.getItem("orbit-verified-badges") || "[]"); }
    catch (error) { console.error("Verified badges could not be restored.", error); return []; }
  });
  const verify = (item) => {
    const updated = Array.from(new Set([...verified, item]));
    try { localStorage.setItem("orbit-verified-badges", JSON.stringify(updated)); }
    catch (error) { notify(`Badge verification could not be saved: ${error.message}`); return; }
    setVerified(updated);
    notify(`${item.split(" · ")[1]} verified for ${item.split(" · ")[0]}.`);
  };
  return <div className="verify-badges">{items.map((item) => { const [name, badge] = item.split(" · "); const isVerified = verified.includes(item); return <div key={item}><span className="badge-art badge-2">✦</span><span><strong>{name}</strong><small>{badge}</small></span><button disabled={isVerified} onClick={() => verify(item)}>{isVerified ? "Verified ✓" : "Verify ✓"}</button></div>; })}</div>;
}

function GradingModal({ submission, onClose, notify }) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api("/grades", { method: "POST", body: JSON.stringify({ student: submission.student, task: submission.task, score, feedback }) });
      notify(`Grade and feedback saved for ${submission.student}.`);
      onClose();
    } catch (gradeError) {
      setError(gradeError.message);
    } finally {
      setSaving(false);
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="profile-modal grading-modal" role="dialog" aria-modal="true" aria-labelledby="grading-title"><button className="modal-close" onClick={onClose} aria-label="Close grading">×</button><span className="eyebrow">REVIEW SUBMISSION</span><h2 id="grading-title">{submission.student}</h2><p>{submission.task}</p><form className="grading-form" onSubmit={submit}><label>Score (0–100)<input type="number" min="0" max="100" step="1" value={score} onChange={(event) => setScore(event.target.value)} required /></label><label>Feedback<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Share a helpful next step…" maxLength={500} required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button" disabled={saving}>{saving ? "Saving feedback…" : "Save grade and feedback"}</button></form></section></div>;
}
function TeacherConcepts({ data }) { return <div className="teacher-concepts">{data.concepts.map((item) => <div className="concept-row" key={item.name}><span>{item.name}</span><span className="concept-meter"><i style={{ width: `${item.score}%` }} /></span><b>{item.score}%</b></div>)}</div>; }
function ParentProgress({ data }) { return <section className="surface"><div className="section-title"><div><h3>Subject strengths</h3><p>Where confidence is growing</p></div><span className="chip chip-violet">This term</span></div>{data.subjects.map((subject) => <div className="parent-subject" key={subject.name}><div><strong>{subject.name}</strong><b>{subject.score}%</b></div><span className="progress-track"><i className={subject.score > 85 ? "mint" : subject.score > 75 ? "violet" : "gold"} style={{ width: `${subject.score}%` }} /></span><small>{subject.score > 85 ? "A real strength" : subject.score > 75 ? "Steady progress" : "A little extra practice"}</small></div>)}</section>; }
function Milestone({ data }) {
  const credits = Number(data.credits || 0);
  const baseLevel = Math.min(5, Math.max(1, Math.floor(credits / 45) + 1));
  const progress = Math.min(100, ((credits % 45) / 45) * 100);
  return <section className="surface milestone-card full-milestone"><div className="milestone-head"><div><h3>Next milestone</h3><p>Level {baseLevel} · Bright Mind</p></div><span className="level-badge">L{baseLevel}</span></div><div className="milestone-track"><i style={{ width: `${progress}%` }} /></div><div className="milestone-foot"><span>{credits.toLocaleString()} credits</span><span>{baseLevel < 5 ? `${45 - (credits % 45)} to next tier` : "Max tier"}</span></div><p className="milestone-caption">{baseLevel < 5 ? `${Math.max(0, 45 - (credits % 45))} more credits to Level ${baseLevel + 1}` : "Top tier unlocked!"} <span>✦</span></p></section>;
}
function Assistant({ user, notify, setPage }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! I'm Orbit, your learning buddy. Need help finding something, or want to share a thought?" }]);
  const send = async (text = value) => {
    if (!text.trim()) return;
    setMessages((items) => [...items, { from: "user", text }]);
    setValue("");
    const lower = text.toLowerCase();
    const subjects = [
      { name: "Mathematics", words: ["math", "equation", "algebra", "fraction", "solve", "calculate", "x +", "x="] },
      { name: "Science", words: ["science", "photosynthesis", "friction", "force", "gravity", "cell", "matter"] },
      { name: "English", words: ["english", "grammar", "poem", "literature", "sentence", "metaphor"] },
      { name: "Social Studies", words: ["social studies", "history", "geography", "constitution", "civics", "empire"] }
    ];
    const detectedSubject = subjects.find((item) => item.words.some((word) => lower.includes(word)))?.name;
    const asksAcademicQuestion = /\b(what is|what are|why|how does|explain|solve|calculate|define|help me understand)\b/.test(lower) || /\d\s*[+\-×÷=]\s*\d/.test(lower);
    const isNavigation = /\b(where|open|show|find|go to|take me|my)\b/.test(lower);
    let response = { text: "I hear you. You can message your class teacher any time.", action: { label: "Open teacher chat", page: "Messages" } };
    if (detectedSubject && asksAcademicQuestion && !isNavigation) {
      response = {
        text: "I cannot clarify your academic questions. Shall I redirect you to teachers chat?",
        action: { label: `Open ${detectedSubject} teacher chat`, page: `Teacher chat · ${detectedSubject}` }
      };
    } else if (lower.includes("dictionary") || lower.includes("vocabulary") || lower.includes("word list")) {
      response = { text: "Your saved vocabulary is alphabetized in the Dictionary.", action: { label: "Open Dictionary", page: "Dictionary" } };
    } else if (lower.includes("handbook") || lower.includes("study guide") || lower.includes("formula")) {
      response = { text: "Subject revision notes and formula sheets are ready in Handbooks.", action: { label: "Open Handbooks", page: "Handbooks" } };
    } else if (lower.includes("dpp") || lower.includes("practice") || lower.includes("solve")) {
      response = { text: "Your adaptive daily practice is ready in Solve.", action: { label: "Open today's practice", page: "Solve" } };
    } else if (lower.includes("assignment") || lower.includes("task")) {
      response = { text: "Your due work is collected in Assignments.", action: { label: "Open Assignments", page: "Assignments" } };
    } else if (lower.includes("teacher") || lower.includes("chat") || lower.includes("message")) {
      response = { text: "Your class conversations are in Messages.", action: { label: "Open Messages", page: "Messages" } };
    } else if (lower.includes("subject") || lower.includes("room")) {
      response = { text: "Open a subject room for lessons, DPPs, resources, and your teacher.", action: { label: "Open Subjects", page: "Subjects" } };
    } else if (lower.includes("learn") || lower.includes("lesson")) {
      response = { text: "Your next short lesson is waiting in Learn.", action: { label: "Open Learn", page: "Learn" } };
    } else if (lower.includes("test") || lower.includes("quiz")) {
      response = { text: "Your weekly check-in is in Test.", action: { label: "Open Test", page: "Test" } };
    } else if (lower.includes("word") || lower.includes("vocabulary activity")) {
      response = { text: "Share a new word in today's Word Discovery activity.", action: { label: "Open Word Discovery", page: "Word Discovery" } };
    }
    try {
      if (lower.includes("complaint") || lower.includes("feedback") || lower.includes("report")) {
        await api("/feedback", { method: "POST", body: JSON.stringify({ message: text, user: user.name }) });
      }
    } catch (feedbackError) {
      response = { text: `I couldn't send that just now: ${feedbackError.message}`, action: null };
    }
    window.setTimeout(() => setMessages((items) => [...items, { from: "bot", ...response }]), 250);
  };
  return <><button className={`assistant-fab ${open ? "fab-open" : ""}`} onClick={() => setOpen(!open)} aria-label={open ? "Close Orbit assistant" : "Open Orbit assistant"}>{open ? "×" : "✦"}{!open && <span className="fab-pulse" />}</button>{open && <aside className="assistant-panel"><div className="assistant-head"><div className="assistant-avatar">✦</div><div><strong>Orbit, your learning buddy</strong><small><span className="online-dot" /> Here to help</small></div><button onClick={() => setOpen(false)}>×</button></div><div className="assistant-messages">{messages.map((message, i) => <div className={`assistant-message ${message.from}`} key={i}>{message.text}{message.action && <button className="assistant-action" onClick={() => { setPage(message.action.page); setOpen(false); }}>{message.action.label} ↗</button>}</div>)}{messages.length === 1 && <div className="quick-prompts">{["Find my DPP", "Open Dictionary", "Where are my assignments?"].map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt} ↗</button>)}</div>}</div><div className="assistant-input"><input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask me anything…" /><button onClick={() => send()}>↑</button></div></aside>}</>;
}
function ProfileModal({ user, score, onClose, onSignOut, onSave }) {
  const [profile, setProfile] = useState({ name: user.name, className: user.className || "8", section: user.section || "A", roll: user.roll || "", classCode: user.classCode || "001" });
  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    onSave({ ...user, ...profile, name: profile.name.trim() });
  };
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="profile-modal"><button className="modal-close" onClick={onClose}>×</button><span className="avatar modal-avatar">{initials(profile.name)}</span><span className="eyebrow">YOUR PROFILE</span><h2>{profile.name} {user.role === "student" && <AcademicTier score={score} />}</h2>{user.role === "student" ? <form className="profile-form" onSubmit={submit}><label>Full name<input value={profile.name} onChange={(e) => update("name", e.target.value)} required /></label><div className="profile-form-row"><label>Class<select value={profile.className} onChange={(e) => update("className", e.target.value)}>{["6", "7", "8", "9", "10"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Section<input value={profile.section} onChange={(e) => update("section", e.target.value)} maxLength="2" required /></label></div><div className="profile-form-row"><label>Roll number<input value={profile.roll} onChange={(e) => update("roll", e.target.value)} required /></label><label>Class code<input value={profile.classCode} onChange={(e) => update("classCode", e.target.value)} maxLength="3" required /></label></div><button className="primary-button profile-save">Save profile</button></form> : <p>{roleLabel(user.role)}{user.child ? ` · Child: ${user.child}` : user.subject ? ` · ${user.subject}` : ""}</p>}<button className="secondary-button profile-logout" onClick={onSignOut}>Sign out of Orbit</button></section></div>;
}
function MilestoneModal({ level, onClose }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="profile-modal milestone-modal" role="dialog" aria-modal="true" aria-labelledby="milestone-title"><button className="modal-close" onClick={onClose} aria-label="Close milestone">×</button><span className="milestone-celebration">✦</span><span className="eyebrow">A NEW MILESTONE</span><h2 id="milestone-title">Level {level} unlocked!</h2><p>Your effort is adding up. Keep exploring, practicing, and collecting badges.</p><button className="primary-button profile-save" onClick={onClose}>Keep learning ↗</button></section></div>;
}
function StatCard({ icon, value, label, note, tint }) { return <div className="surface stat-card"><span className={`stat-icon ${tint}`}>{icon}</span><div className="stat-copy"><strong>{value}</strong><span>{label}</span><small>{note}</small></div><span className="stat-spark">↗</span></div>; }
function getAcademicTier(score) {
  return Number(score) >= 85 ? "Gold" : Number(score) >= 70 ? "Silver" : "Bronze";
}
function AcademicTier({ score }) {
  const tier = getAcademicTier(score);
  const medal = { Gold: "🥇", Silver: "🥈", Bronze: "🥉" }[tier];
  return <span className={`academic-tier tier-${tier.toLowerCase()}`} title={`${tier} academic tier`}>{medal} {tier}</span>;
}
function getLoginStreak(days) {
  const signedInDays = new Set(days);
  const cursor = new Date();
  let date = cursor.toISOString().slice(0, 10);
  if (!signedInDays.has(date)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    date = cursor.toISOString().slice(0, 10);
  }
  let streak = 0;
  while (signedInDays.has(date)) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    date = cursor.toISOString().slice(0, 10);
  }
  return streak;
}
function getUnlockedBadges(credits) {
  const unlocked = [];
  if (credits >= 40) unlocked.push("Math Wizard");
  if (credits >= 80) unlocked.push("Streak Master");
  if (credits >= 120) unlocked.push("Curious Mind");
  if (credits >= 160) unlocked.push("Kind Helper");
  if (credits >= 220) unlocked.push("Science Explorer");
  if (credits >= 300) unlocked.push("Perfect Week");
  return unlocked;
}
function initials(name = "") { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function roleLabel(role) { return ({ student: "Student", parent: "Parent", teacher: "Teacher" })[role] || "Learner"; }
function welcome(role) { return ({ student: "GOOD TO SEE YOU AGAIN,", parent: "WELCOME BACK,", teacher: "A NEW DAY TO INSPIRE," })[role]; }

createRoot(document.getElementById("root")).render(<App />);
