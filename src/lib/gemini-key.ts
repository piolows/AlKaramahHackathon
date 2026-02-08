const apiKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY_4, process.env.GEMINI_API_KEY_5];
let index = Math.floor(Math.random() * apiKeys.length);
export default function getGeminiApiKey() {
	if (index >= apiKeys.length)
		index = 0;
	console.log(apiKeys, apiKeys[index],index);
	return apiKeys[index++];
}