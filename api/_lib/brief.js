const Anthropic = require('@anthropic-ai/sdk');

function buildPrompt(spaceType, notes) {
  const notesLine = notes && notes.trim()
    ? `\nAdditional context: ${notes.trim()}`
    : '';
  return `You are a spatial design consultant. Generate a concise spatial design brief (~400 words) for a ${spaceType}.${notesLine}

Cover each of these four areas with specific, actionable recommendations tailored to a ${spaceType}:

## Lighting
Recommend light sources, colour temperature, layering strategy, and any focal lighting for the space type.

## Materials & Finishes
Recommend surfaces, textures, and finishes appropriate to the space type, durability needs, and atmosphere.

## Acoustics
Recommend acoustic treatment strategies — panels, soft furnishings, ceiling treatment — suited to the noise profile of a ${spaceType}.

## Layout & Flow
Recommend spatial organisation, circulation paths, zoning, and furniture arrangement principles for a ${spaceType}.

Be specific, technical, and professional. Do not use filler phrases.`;
}

async function generateBrief(spaceType, notes) {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildPrompt(spaceType, notes) }],
  });
  return message.content[0].text;
}

module.exports = { buildPrompt, generateBrief };
