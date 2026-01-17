import { initiateDeployment, mergeFromStaging } from '../../../lib/decap-plus/util';

// These secrets are set in Pages settings.
interface Env {
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
  CF_PROD_PROJECT: string;
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {

  // First let's merge the changes from the staging branch to main
  try {
    await mergeFromStaging(env);
  } catch (err) {
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : "Merge failed"
    }), { status: 500 });
  }

  const response = await initiateDeployment(env.CF_ACCOUNT_ID, env.CF_API_TOKEN, env.CF_PROD_PROJECT);
  const data = await response.json();
  if (!response.ok) {
    return new Response(JSON.stringify({ error: data }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true, deployment: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
