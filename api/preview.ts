import { initiateDeployment } from '../../../lib/decap-plus/util';

// These secrets are set in Pages settings.
interface Env {
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
  CF_EDIT_PROJECT: string;
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {

  console.log("got preview request");
  const response = await initiateDeployment(env.CF_ACCOUNT_ID, env.CF_API_TOKEN, env.CF_EDIT_PROJECT);
  console.log("got preview response");
  const data = await response.json();
  if (!response.ok) {
    return new Response(JSON.stringify({ error: data }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true, deployment: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
