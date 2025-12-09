interface Env {
  SLACK_BOT_TOKEN: string;
  SLACK_CHANNEL_ID: string;
  SLACK_STAGING_CHANNEL_ID?: string;
}

interface Update {
  headline: string;
  subtext?: string;
}

export function b(update: Update) {
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

export async function push(env: Env, update: Update, isStaging: boolean = false): Promise<string | null> {
  const blocks = b(update);
  const x = isStaging ? env.SLACK_STAGING_CHANNEL_ID : env.SLACK_CHANNEL_ID;

  const r = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: x,
      blocks,
      text: update.headline,
    }),
  });

  const data = await r.json();

  if (!data.ok) {
    console.error("slack error", data.error);
    return null;
  }

  return data.ts;
}

export async function deleteSlackMessage(env: Env, ts: string): Promise<boolean> {
  const r = await fetch("https://slack.com/api/chat.delete", {
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

  const data = await r.json();

  if (!data.ok) {
    console.error("slack error", data.error);
    return false;
  }

  return true;
}

export async function promote(env: Env, update: Update, stagingTs: string): Promise<string | null> {
  const m = await push(env, update, false);

  if (!m) {
    console.error("failed to promote");
    return null;
  }

  const x = await fetch("https://slack.com/api/chat.delete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: env.SLACK_STAGING_CHANNEL_ID,
      ts: stagingTs,
    }),
  });

  const d = await x.json();

  if (!d.ok) {
    console.error("slack error", d.error);
  }

  return m;
}
