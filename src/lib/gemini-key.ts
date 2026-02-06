let index = 0;
export default function getGeminiApiKey() {
	  const apiKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY_4, process.env.GEMINI_API_KEY_5];
	  console.log({apiKeys, index})
	  return apiKeys[index++ % apiKeys.length];
}