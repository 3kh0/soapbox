interface SlackEnv {
  SLACK_BOT_TOKEN: string;
  SLACK_CHANNEL_ID: string;
}

interface UpdatePayload {
  headline: string;
  subtext?: string;
}

export function buildUpdateBlocks(update: UpdatePayload) {
  const blocks: any[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: update.headline,
        emoji: true,
      },
    },
  ];

  if (update.subtext) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: update.subtext,
      },
    });
  }

  return blocks;
}

export async function postSlackUpdate(env: SlackEnv, update: UpdatePayload): Promise<string | null> {
  const blocks = buildUpdateBlocks(update);

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: env.SLACK_CHANNEL_ID,
      blocks,
      text: update.headline,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    console.error("Slack API error:", data.error);
    return null;
  }

  return data.ts;
}

export async function deleteSlackMessage(env: SlackEnv, ts: string): Promise<boolean> {
  const response = await fetch("https://slack.com/api/chat.delete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: env.SLACK_CHANNEL_ID,
      ts,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    console.error("Slack delete error:", data.error);
    return false;
  }

  return true;
}
