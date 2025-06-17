import { fetchMessagesFromChannels, postMessageToChannel } from '../utils/slack.js';
import { summarizeText } from '../utils/openai.js';

export default async function handler(req, res) {
  const channels = process.env.SLACK_CHANNELS.split(',').map(c => c.trim());
  const targetChannel = process.env.SLACK_TARGET_CHANNEL;

  let allMessages = [];

  for (const channel of channels) {
    const messages = await fetchMessagesFromChannels(channel);
    allMessages.push(`Channel: #${channel}\n` + messages.join('\n'));
  }

  const fullText = allMessages.join('\n\n');
  const summary = await summarizeText(fullText);

  await postMessageToChannel(targetChannel, summary);
  res.status(200).json({ status: "OK", summary });
}
