import dotenv from "dotenv";


dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

console.log("Testing Gemini API...");
console.log("Key present:", !!GEMINI_API_KEY);

if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

async function testGemini() {
    try {
        const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, are you working?" }] }],
                generationConfig: { maxOutputTokens: 50 },
            }),
        });

        const text = await response.text();
        console.log("Response Status:", response.status);

        if (!response.ok) {
            console.error("❌ API Error:", text);
        } else {
            console.log("✅ Success! Response:");
            const data = JSON.parse(text);
            console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
        }
    } catch (error) {
        console.error("❌ Network/Script Error:", error);
    }
}

testGemini();
