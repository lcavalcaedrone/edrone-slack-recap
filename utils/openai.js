import fetch from 'node-fetch';

export async function summarizeText(text) {
  const apiKey = process.env.OPENAI_API_KEY;

  const body = {
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "Você é um assistente que resume conversas do Slack. Destaque tópicos importantes, decisões e dúvidas. Não inclua nomes pessoais ou dados sensíveis."
      },
      {
        role: "user",
        content: text
      }
    ]
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "[Resumo indisponível]";
}
