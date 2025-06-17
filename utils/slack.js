import fetch from 'node-fetch';

export async function fetchMessagesFromChannels(channelName) {
  const token = process.env.SLACK_BOT_TOKEN;
  const channelList = await fetch("https://slack.com/api/conversations.list", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const channel = channelList.channels.find(c => c.name === channelName);
  if (!channel) return [];

  const messagesResp = await fetch(`https://slack.com/api/conversations.history?channel=${channel.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  return messagesResp.messages.map(m => m.text);
}

export async function postMessageToChannel(channelName, text) {
  const token = process.env.SLACK_BOT_TOKEN;
  const channelList = await fetch("https://slack.com/api/conversations.list", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const channel = channelList.channels.find(c => c.name === channelName);
  if (!channel) throw new Error("Channel not found");

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ channel: channel.id, text })
  });
}
