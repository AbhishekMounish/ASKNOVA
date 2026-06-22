import "dotenv/config";

const getGeminiAIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    }),
  };

  try {
    const model = "gemini-2.5-flash";

    let retries = 3;

    while (retries > 0) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        options
      );

      const data = await response.json();

      // Success
      if (response.ok) {
        if (data.candidates?.length) {
          return data.candidates[0].content.parts[0].text;
        }

        return "[ERROR] No response generated.";
      }

      // Gemini overloaded
      if (response.status === 503) {
        retries--;

        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }

        return "[ERROR] AskNova is busy right now. Please try again later.";
      }

      // Quota exceeded
      if (response.status === 429) {
        return "[ERROR] AskNova quota exceeded. Please wait and try again.";
      }

      // Any other error
      return ` [ERROR] Error ${response.status}`;
    }
  } catch (e) {
    console.log("Gemini Error:", e);
    return "[ERROR] Something went wrong.";
  }
};

export default getGeminiAIResponse;