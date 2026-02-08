let index = Math.floor(Math.random() * 5);
const apiKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY_4, process.env.GEMINI_API_KEY_5];
export default function getGeminiApiKey() {
	console.log({apiKeys, index})
	if (index >= apiKeys.length)
		index = 0;
	return apiKeys[index++];
}